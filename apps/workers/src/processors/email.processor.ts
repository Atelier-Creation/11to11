import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Processor('email_queue')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    super();
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST') || 'localhost',
      port: Number(this.configService.get<number>('SMTP_PORT')) || 1025,
      secure: false,
    });
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing async email job: ${job.name} (Job ID: ${job.id})`);

    switch (job.name) {
      case 'order.created':
        return this.sendOrderConfirmation(job.data);
      case 'inventory.alert':
        return this.sendLowStockAlert(job.data);
      default:
        this.logger.warn(`Unknown email job type: ${job.name}`);
    }
  }

  private async sendOrderConfirmation(data: {
    orderNumber: string;
    customerEmail: string;
    totalAmount: number;
    itemsCount: number;
  }) {
    try {
      await this.transporter.sendMail({
        from: '"11 11 Concierge" <concierge@eleven11atelier.com>',
        to: data.customerEmail,
        subject: `11 11 Atelier Order Confirmation #${data.orderNumber}`,
        html: `
          <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF9F5; padding: 40px; color: #111;">
            <div style="text-align: center; border-bottom: 1px solid #D4AF37; padding-bottom: 20px;">
              <h1 style="letter-spacing: 0.2em; font-size: 28px; margin: 0;">11 11</h1>
              <p style="text-transform: uppercase; font-size: 11px; letter-spacing: 0.15em; color: #888; margin-top: 5px;">Haut Atelier Edition</p>
            </div>
            <div style="padding: 30px 0;">
              <h2 style="font-size: 20px; font-weight: normal;">Thank you for your acquisition.</h2>
              <p style="line-height: 1.6; color: #444;">
                Your order <strong>#${data.orderNumber}</strong> has been received and transferred to our master artisans for inspection, white-glove packaging, and dispatch.
              </p>
              <div style="background: #FFF; border: 1px solid #E5E0D8; padding: 20px; margin: 25px 0;">
                <p style="margin: 5px 0;"><strong>Order Reference:</strong> ${data.orderNumber}</p>
                <p style="margin: 5px 0;"><strong>Items Acquired:</strong> ${data.itemsCount}</p>
                <p style="margin: 5px 0;"><strong>Total Valuation:</strong> ₹${data.totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        `,
      });
      this.logger.log(`Order confirmation email sent to ${data.customerEmail} for #${data.orderNumber}`);
    } catch (err: any) {
      this.logger.warn(`Could not deliver email to SMTP (Mailpit may be offline in dev): ${err.message}`);
    }
  }

  private async sendLowStockAlert(data: { sku: string; remainingStock: number }) {
    this.logger.warn(`LOW STOCK ALERT: Variant ${data.sku} only has ${data.remainingStock} units left`);
  }
}
