import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaClient, ReservationStatus } from '@prisma/client';

@Processor('inventory_queue')
export class InventoryCleanupProcessor extends WorkerHost {
  private readonly logger = new Logger(InventoryCleanupProcessor.name);
  private prisma = new PrismaClient();

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Executing inventory job: ${job.name}`);

    if (job.name === 'inventory.cleanup') {
      const expired = await this.prisma.inventoryReservation.updateMany({
        where: {
          status: ReservationStatus.ACTIVE,
          expiresAt: { lt: new Date() },
        },
        data: {
          status: ReservationStatus.EXPIRED,
        },
      });

      if (expired.count > 0) {
        this.logger.log(`Released ${expired.count} expired checkout reservations`);
      }
      return { expiredCleaned: expired.count };
    }
  }
}
