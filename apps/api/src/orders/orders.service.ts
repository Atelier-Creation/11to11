import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Optional,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { Queue } from 'bullmq';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly inventoryService: InventoryService,
    @Optional() @Inject('EMAIL_QUEUE') private readonly emailQueue?: Queue,
  ) {}

  async createOrder(dto: CreateOrderDto, userId?: string) {
    // 1. Get cart and recalculate totals
    const cart = await this.cartService.getOrCreateCart({
      userId,
      sessionId: dto.cartId,
    });

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cannot place an order with an empty shopping bag');
    }

    // 2. Reserve stock before order generation
    const reservationItems = cart.items.map((i) => ({
      variantId: i.variantId,
      quantity: i.quantity,
    }));

    await this.inventoryService.reserveStock(cart.id, reservationItems);

    // 3. Generate unique order number (e.g. 1111-2026-XXXXX)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `1111-2026-${randomSuffix}`;

    return this.prisma.$transaction(async (tx) => {
      // Create shipping address record
      const address = await tx.address.create({
        data: {
          userId: userId || (await this.getOrCreateGuestUser(dto.customerEmail, tx)).id,
          fullName: dto.shippingAddress.fullName,
          phone: dto.shippingAddress.phone,
          streetLine1: dto.shippingAddress.streetLine1,
          streetLine2: dto.shippingAddress.streetLine2,
          city: dto.shippingAddress.city,
          state: dto.shippingAddress.state,
          postalCode: dto.shippingAddress.postalCode,
          country: dto.shippingAddress.country || 'IN',
        },
      });

      // Find coupon ID if applied
      let couponId: string | undefined = undefined;
      if (cart.appliedCoupon) {
        const coupon = await tx.coupon.findUnique({ where: { code: cart.appliedCoupon } });
        if (coupon) {
          couponId = coupon.id;
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usageCount: { increment: 1 } },
          });
        }
      }

      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || address.userId,
          customerEmail: dto.customerEmail.toLowerCase(),
          customerPhone: dto.customerPhone,
          status: OrderStatus.CONFIRMED, // Placed and confirmed
          subtotal: cart.subtotal,
          discountAmount: cart.discountAmount,
          taxAmount: cart.taxAmount,
          shippingFee: cart.shippingFee,
          totalAmount: cart.grandTotal,
          currency: 'INR',
          shippingAddressId: address.id,
          couponId,
          customerNote: dto.customerNote,
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              title: item.product.title,
              sku: item.variant.sku,
              colorName: item.variant.colorName,
              size: item.variant.size,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              imageUrl: item.product.primaryImage?.url,
            })),
          },
          statusHistory: {
            create: {
              fromStatus: OrderStatus.PENDING_PAYMENT,
              toStatus: OrderStatus.CONFIRMED,
              note: 'Order successfully placed and confirmed by atelier concierge',
            },
          },
          payments: {
            create: {
              gateway: dto.paymentGateway,
              amount: cart.grandTotal,
              currency: 'INR',
              status: PaymentStatus.CAPTURED,
              gatewayTxnId: `TXN-${orderNumber}`,
            },
          },
        },
        include: {
          items: true,
          shippingAddress: true,
          payments: true,
        },
      });

      // 4. Fulfill inventory reservation permanently
      await this.inventoryService.fulfillCartReservations(cart.id);

      // 5. Empty cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.update({ where: { id: cart.id }, data: { couponCode: null } });

      // 6. Queue asynchronous BullMQ email & invoice task
      try {
        if (this.emailQueue) {
          await this.emailQueue.add('order.created', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerEmail: order.customerEmail,
            totalAmount: Number(order.totalAmount),
            itemsCount: order.items.length,
          });
          this.logger.log(`Dispatched BullMQ order.created job for ${order.orderNumber}`);
        }
      } catch (err: any) {
        this.logger.warn(`Could not dispatch BullMQ job (Redis may be offline in dev): ${err.message}`);
      }

      return order;
    });
  }

  async getCustomerOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        shippingAddress: true,
        payments: true,
        shipments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderByNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        shippingAddress: true,
        payments: true,
        shipments: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order '${orderNumber}' not found in atelier records`);
    }

    return order;
  }

  async getAdminOrders(params: { status?: OrderStatus; page?: number; limit?: number }) {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) {
      where.status = params.status;
    }

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: true,
          shippingAddress: true,
          payments: true,
          shipments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { shipments: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const newStatus = dto.status as OrderStatus;

    return this.prisma.$transaction(async (tx) => {
      // Add status history
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          fromStatus: order.status,
          toStatus: newStatus,
          note: dto.note || `Status updated to ${newStatus}`,
        },
      });

      // If tracking info provided, create or update shipment
      if (dto.trackingCode) {
        if (order.shipments.length > 0) {
          await tx.shipment.update({
            where: { id: order.shipments[0].id },
            data: {
              trackingNumber: dto.trackingCode,
              courierName: dto.courierName || 'Delhivery Express',
              shippedAt: new Date(),
            },
          });
        } else {
          await tx.shipment.create({
            data: {
              orderId,
              trackingNumber: dto.trackingCode,
              courierName: dto.courierName || 'Delhivery Express',
              shippedAt: new Date(),
            },
          });
        }
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
        include: { items: true, statusHistory: true, shipments: true },
      });
    });
  }

  private async getOrCreateGuestUser(email: string, tx: any) {
    let user = await tx.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          firstName: 'Guest',
          lastName: 'Client',
          passwordHash: 'GUEST_UNREGISTERED',
        },
      });
    }
    return user;
  }
}
