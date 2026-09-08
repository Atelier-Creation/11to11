import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate payment for an order and retrieve gateway credentials' })
  async initiatePayment(@Body('orderId') orderId: string) {
    return this.paymentsService.initiatePayment(orderId);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify payment completion (client signature or webhook)' })
  async verifyPayment(
    @Body()
    body: {
      orderId: string;
      gatewayOrderId?: string;
      paymentId: string;
      signature?: string;
    },
  ) {
    if (body.signature && body.gatewayOrderId) {
      const isValid = this.paymentsService.verifyRazorpaySignature({
        orderId: body.gatewayOrderId,
        paymentId: body.paymentId,
        signature: body.signature,
      });

      if (!isValid) {
        throw new BadRequestException('Invalid payment signature');
      }
    }

    return this.paymentsService.handlePaymentSuccess(body.orderId, body.paymentId, body);
  }
}
