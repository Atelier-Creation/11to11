import { BadRequestException } from '@nestjs/common';
import { InventoryService } from '../src/inventory/inventory.service';
import { ReservationStatus } from '@prisma/client';

describe('InventoryService - Atomic Reservations', () => {
  let service: InventoryService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      $transaction: jest.fn(async (cb) => {
        return cb(mockPrisma);
      }),
      inventoryItem: {
        findMany: jest.fn(),
      },
      inventoryReservation: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      productVariant: {
        findUnique: jest.fn(),
      },
    };

    service = new InventoryService(mockPrisma);
  });

  it('should successfully reserve stock when sufficient available quantity exists', async () => {
    // 10 on hand, 2 reserved = 8 available
    mockPrisma.inventoryItem.findMany.mockResolvedValue([
      { variantId: 'var-1', warehouseId: 'wh-1', quantityOnHand: 10 },
    ]);
    mockPrisma.inventoryReservation.findMany.mockResolvedValue([
      { variantId: 'var-1', quantity: 2, status: ReservationStatus.ACTIVE },
    ]);
    mockPrisma.inventoryReservation.create.mockResolvedValue({
      id: 'res-1',
      variantId: 'var-1',
      quantity: 3,
      status: ReservationStatus.ACTIVE,
    });

    const result = await service.reserveStock('cart-1', [
      { variantId: 'var-1', quantity: 3 },
    ]);

    expect(result.success).toBe(true);
    expect(result.reservationsCount).toBe(1);
    expect(mockPrisma.inventoryReservation.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          variantId: 'var-1',
          cartId: 'cart-1',
          quantity: 3,
          status: ReservationStatus.ACTIVE,
        }),
      }),
    );
  });

  it('should throw BadRequestException when requested quantity exceeds available stock', async () => {
    // 5 on hand, 4 reserved = only 1 available
    mockPrisma.inventoryItem.findMany.mockResolvedValue([
      { variantId: 'var-1', warehouseId: 'wh-1', quantityOnHand: 5 },
    ]);
    mockPrisma.inventoryReservation.findMany.mockResolvedValue([
      { variantId: 'var-1', quantity: 4, status: ReservationStatus.ACTIVE },
    ]);
    mockPrisma.productVariant.findUnique.mockResolvedValue({
      id: 'var-1',
      size: 'M',
      colorName: 'Onyx Black',
      product: { title: 'The Sovereign Silk Trench' },
    });

    await expect(
      service.reserveStock('cart-1', [{ variantId: 'var-1', quantity: 2 }]),
    ).rejects.toThrow(BadRequestException);
  });
});
