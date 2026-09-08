import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PaymentStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates a payment order payload for client-side checkout
   */
  async initiatePayment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID') || 'rzp_test_placeholder';
    const razorpayOrderId = `order_${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '')}`;

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: Math.round(Number(order.totalAmount) * 100), // in paise
      currency: 'INR',
      razorpayKeyId: keyId,
      razorpayOrderId,
      customer: {
        email: order.customerEmail,
        phone: order.customerPhone,
      },
    };
  }

  /**
   * Verifies Razorpay HMAC SHA-256 signature
   */
  verifyRazorpaySignature(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean {
    const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'rzp_test_secretKey456';
    const body = `${params.orderId}|${params.paymentId}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

    return expectedSignature === params.signature;
  }

  /**
   * Handles payment success webhook / client verification
   */
  async handlePaymentSuccess(orderId: string, transactionId: string, rawPayload?: any) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: { orderId },
      });

      if (payment) {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.CAPTURED,
            gatewayTxnId: transactionId,
            rawPayload: rawPayload || {},
          },
        });
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CONFIRMED },
      });

      return { success: true, message: 'Payment successfully captured and order confirmed' };
    });
  }
}
