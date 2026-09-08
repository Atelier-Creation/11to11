import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { DiscountType } from '@prisma/client';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listCoupons() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCoupon(data: {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    endDate?: Date;
  }) {
    const cleanCode = data.code.trim().toUpperCase();
    const existing = await this.prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      throw new ConflictException(`Coupon code '${cleanCode}' already exists`);
    }

    return this.prisma.coupon.create({
      data: {
        code: cleanCode,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        maxDiscount: data.maxDiscount,
        usageLimit: data.usageLimit,
        endDate: data.endDate,
      },
    });
  }

  async toggleCoupon(id: string, isActive: boolean) {
    return this.prisma.coupon.update({
      where: { id },
      data: { isActive },
    });
  }
}
