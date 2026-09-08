import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { DiscountType } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCart(params: { userId?: string; sessionId?: string }) {
    let cart = null;

    if (params.userId) {
      cart = await this.prisma.cart.findFirst({
        where: { userId: params.userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: { images: { where: { isPrimary: true }, take: 1 } },
                  },
                },
              },
            },
          },
        },
      });
    } else if (params.sessionId) {
      cart = await this.prisma.cart.findUnique({
        where: { sessionId: params.sessionId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: { images: { where: { isPrimary: true }, take: 1 } },
                  },
                },
              },
            },
          },
        },
      });
    }

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId: params.userId,
          sessionId: params.sessionId,
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: { images: { where: { isPrimary: true }, take: 1 } },
                  },
                },
              },
            },
          },
        },
      });
    }

    return this.formatCartTotals(cart);
  }

  async addItem(cartId: string, variantId: string, quantity: number = 1) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Garment variant not found');
    }

    // Upsert cart item
    await this.prisma.cartItem.upsert({
      where: {
        cartId_variantId: { cartId, variantId },
      },
      create: {
        cartId,
        variantId,
        quantity,
      },
      update: {
        quantity: { increment: quantity },
      },
    });

    return this.getCartById(cartId);
  }

  async updateItemQuantity(cartId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(cartId, itemId);
    }

    await this.prisma.cartItem.update({
      where: { id: itemId, cartId },
      data: { quantity },
    });

    return this.getCartById(cartId);
  }

  async removeItem(cartId: string, itemId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { id: itemId, cartId },
    });

    return this.getCartById(cartId);
  }

  async applyCoupon(cartId: string, couponCode: string) {
    const cleanCode = couponCode.trim().toUpperCase();
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      throw new BadRequestException('Invalid or inactive promotional voucher code');
    }

    if (coupon.endDate && coupon.endDate < new Date()) {
      throw new BadRequestException('This promotional voucher has expired');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('This promotional voucher limit has been reached');
    }

    await this.prisma.cart.update({
      where: { id: cartId },
      data: { couponCode: cleanCode },
    });

    return this.getCartById(cartId);
  }

  async removeCoupon(cartId: string) {
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { couponCode: null },
    });

    return this.getCartById(cartId);
  }

  private async getCartById(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { images: { where: { isPrimary: true }, take: 1 } },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Shopping bag not found');
    }

    return this.formatCartTotals(cart);
  }

  private async formatCartTotals(cart: any) {
    let subtotal = 0;

    const formattedItems = cart.items.map((item: any) => {
      const price = Number(item.variant.price);
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      return {
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: price,
        totalPrice: itemTotal,
        variant: {
          id: item.variant.id,
          sku: item.variant.sku,
          colorName: item.variant.colorName,
          colorHex: item.variant.colorHex,
          size: item.variant.size,
          price: price,
          compareAtPrice: item.variant.compareAtPrice ? Number(item.variant.compareAtPrice) : null,
        },
        product: {
          id: item.variant.product.id,
          title: item.variant.product.title,
          slug: item.variant.product.slug,
          primaryImage: item.variant.product.images[0] || null,
        },
      };
    });

    // Calculate coupon discount
    let discountAmount = 0;
    if (cart.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: cart.couponCode },
      });

      if (coupon && coupon.isActive) {
        const minAmount = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
        if (subtotal >= minAmount) {
          if (coupon.discountType === DiscountType.PERCENTAGE) {
            const calculatedDiscount = (subtotal * Number(coupon.discountValue)) / 100;
            const maxDiscount = coupon.maxDiscount ? Number(coupon.maxDiscount) : Infinity;
            discountAmount = Math.min(calculatedDiscount, maxDiscount);
          } else if (coupon.discountType === DiscountType.FIXED_AMOUNT) {
            discountAmount = Math.min(Number(coupon.discountValue), subtotal);
          }
        }
      }
    }

    // Complimentary insured white-glove shipping on orders over ₹25,000, else ₹1,500
    const shippingFee = subtotal === 0 || subtotal >= 25000 ? 0 : 1500;

    // GST (included or standard 12% for luxury silk and apparel)
    const taxableAmount = Math.max(subtotal - discountAmount, 0);
    const taxAmount = Math.round(taxableAmount * 0.12);
    const grandTotal = taxableAmount + shippingFee + taxAmount;

    return {
      id: cart.id,
      userId: cart.userId,
      sessionId: cart.sessionId,
      items: formattedItems,
      itemsCount: formattedItems.reduce((acc: number, item: any) => acc + item.quantity, 0),
      subtotal,
      discountAmount,
      shippingFee,
      taxAmount,
      grandTotal,
      appliedCoupon: cart.couponCode,
    };
  }
}
