import { CartService } from '../src/cart/cart.service';
import { DiscountType } from '@prisma/client';

describe('CartService - Pricing & Promotion Calculations', () => {
  let service: CartService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      cart: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      coupon: {
        findUnique: jest.fn(),
      },
      cartItem: {
        upsert: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    service = new CartService(mockPrisma);
  });

  it('should correctly calculate subtotal, 15% discount for WELCOME11, and free shipping over ₹25,000', async () => {
    mockPrisma.cart.findFirst.mockResolvedValue({
      id: 'cart-1',
      couponCode: 'WELCOME11',
      items: [
        {
          id: 'item-1',
          variantId: 'var-1',
          quantity: 1,
          variant: {
            id: 'var-1',
            sku: '1111-TRN-BLK-M',
            colorName: 'Onyx Black',
            colorHex: '#111111',
            size: 'M',
            price: 48500,
            product: { id: 'p-1', title: 'Silk Trench', slug: 'silk-trench', images: [] },
          },
        },
      ],
    });

    mockPrisma.coupon.findUnique.mockResolvedValue({
      code: 'WELCOME11',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      minOrderAmount: 20000,
      isActive: true,
    });

    const result = await service.getOrCreateCart({ userId: 'user-1' });

    expect(result.subtotal).toBe(48500);
    // 15% of 48500 = 7275
    expect(result.discountAmount).toBe(7275);
    // Subtotal > 25000 -> Free shipping
    expect(result.shippingFee).toBe(0);
    // 48500 - 7275 = 41225 taxable + 12% GST = 41225 + 4947 = 46172
    expect(result.grandTotal).toBe(41225 + Math.round(41225 * 0.12));
  });
});
