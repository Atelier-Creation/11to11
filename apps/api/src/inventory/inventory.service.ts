import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Atomically reserve stock for checkout with 15-minute expiration lock
   */
  async reserveStock(cartId: string, items: { variantId: string; quantity: number }[]) {
    return this.prisma.$transaction(async (tx) => {
      const reservations = [];
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15-minute TTL

      for (const item of items) {
        // 1. Fetch total stock on hand
        const inventoryItems = await tx.inventoryItem.findMany({
          where: { variantId: item.variantId },
        });

        const totalOnHand = inventoryItems.reduce((acc, curr) => acc + curr.quantityOnHand, 0);

        // 2. Fetch all currently active, non-expired reservations
        const activeReservations = await tx.inventoryReservation.findMany({
          where: {
            variantId: item.variantId,
            status: ReservationStatus.ACTIVE,
            expiresAt: { gt: new Date() },
          },
        });

        const reservedTotal = activeReservations.reduce((acc, curr) => acc + curr.quantity, 0);
        const available = totalOnHand - reservedTotal;

        if (available < item.quantity) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          });

          throw new BadRequestException(
            `Insufficient atelier stock for ${variant?.product?.title || 'item'} (${variant?.size || ''} / ${variant?.colorName || ''}). Only ${Math.max(available, 0)} pieces remaining.`,
          );
        }

        // 3. Create or update reservation for this cart
        const reservation = await tx.inventoryReservation.create({
          data: {
            variantId: item.variantId,
            cartId,
            quantity: item.quantity,
            expiresAt,
            status: ReservationStatus.ACTIVE,
          },
        });

        reservations.push(reservation);
      }

      return {
        success: true,
        expiresAt,
        reservationsCount: reservations.length,
      };
    });
  }

  /**
   * Release reservation when user empties cart or cancels checkout
   */
  async releaseCartReservations(cartId: string) {
    const updated = await this.prisma.inventoryReservation.updateMany({
      where: {
        cartId,
        status: ReservationStatus.ACTIVE,
      },
      data: {
        status: ReservationStatus.CANCELLED,
      },
    });

    return { releasedCount: updated.count };
  }

  /**
   * Clean up all expired reservations (called by BullMQ worker scheduler every 2 mins)
   */
  async cleanupExpiredReservations() {
    const expired = await this.prisma.inventoryReservation.updateMany({
      where: {
        status: ReservationStatus.ACTIVE,
        expiresAt: { lt: new Date() },
      },
      data: {
        status: ReservationStatus.EXPIRED,
      },
    });

    return { expiredCount: expired.count };
  }

  /**
   * Fulfill reservation when order payment succeeds: deducts quantityOnHand permanently
   */
  async fulfillCartReservations(cartId: string) {
    return this.prisma.$transaction(async (tx) => {
      const activeReservations = await tx.inventoryReservation.findMany({
        where: {
          cartId,
          status: ReservationStatus.ACTIVE,
        },
      });

      for (const res of activeReservations) {
        // Find default or first warehouse holding this variant
        const inventoryItem = await tx.inventoryItem.findFirst({
          where: { variantId: res.variantId },
        });

        if (inventoryItem) {
          await tx.inventoryItem.update({
            where: { id: inventoryItem.id },
            data: {
              quantityOnHand: { decrement: res.quantity },
            },
          });
        }

        await tx.inventoryReservation.update({
          where: { id: res.id },
          data: { status: ReservationStatus.FULFILLED },
        });
      }

      return { fulfilledCount: activeReservations.length };
    });
  }

  /**
   * Admin: Adjust warehouse stock balance
   */
  async adjustStock(variantId: string, warehouseId: string, quantityOnHand: number) {
    return this.prisma.inventoryItem.upsert({
      where: {
        variantId_warehouseId: { variantId, warehouseId },
      },
      create: {
        variantId,
        warehouseId,
        quantityOnHand,
        reservedQuantity: 0,
      },
      update: {
        quantityOnHand,
      },
    });
  }

  /**
   * Admin: Get all inventory levels with low stock alerts (< 5 units)
   */
  async getInventoryOverview() {
    const items = await this.prisma.inventoryItem.findMany({
      include: {
        warehouse: true,
        variant: {
          include: {
            product: {
              select: { id: true, title: true, slug: true },
            },
          },
        },
      },
      orderBy: { quantityOnHand: 'asc' },
    });

    return items.map((item) => ({
      id: item.id,
      variantId: item.variantId,
      sku: item.variant.sku,
      productTitle: item.variant.product.title,
      color: item.variant.colorName,
      size: item.variant.size,
      warehouse: item.warehouse.name,
      quantityOnHand: item.quantityOnHand,
      isLowStock: item.quantityOnHand < 5,
    }));
  }
}
