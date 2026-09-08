import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, DiscountType } from '@prisma/client';

@ApiTags('Promotions & Coupons')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get('coupons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.MERCHANDISER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all promotional coupon codes (Staff only)' })
  async listCoupons() {
    return this.promotionsService.listCoupons();
  }

  @Post('coupons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new promotional campaign coupon (Admin only)' })
  async createCoupon(
    @Body()
    body: {
      code: string;
      discountType: DiscountType;
      discountValue: number;
      minOrderAmount?: number;
      maxDiscount?: number;
      usageLimit?: number;
      endDate?: string;
    },
  ) {
    return this.promotionsService.createCoupon({
      ...body,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    });
  }

  @Patch('coupons/:id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate or deactivate a coupon (Admin only)' })
  async toggleCoupon(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.promotionsService.toggleCoupon(id, isActive);
  }
}
