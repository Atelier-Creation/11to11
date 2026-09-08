import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { Request } from 'express';

@ApiTags('Cart & Shopping Bag')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private extractCartIdentity(req: Request, sessionHeader?: string) {
    const userId = req.user?.['id'];
    const sessionId = sessionHeader || req.cookies?.sessionId || 'guest-session-default';
    return { userId, sessionId };
  }

  @Get()
  @ApiOperation({ summary: 'Get current shopping bag with totals, taxes, and applied promotions' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Anonymous guest cart session ID' })
  async getCart(@Req() req: Request, @Headers('x-session-id') sessionHeader?: string) {
    const { userId, sessionId } = this.extractCartIdentity(req, sessionHeader);
    return this.cartService.getOrCreateCart({ userId, sessionId });
  }

  @Post('items')
  @ApiOperation({ summary: 'Add a garment variant to shopping bag' })
  async addItem(
    @Req() req: Request,
    @Body() body: { variantId: string; quantity?: number },
    @Headers('x-session-id') sessionHeader?: string,
  ) {
    const { userId, sessionId } = this.extractCartIdentity(req, sessionHeader);
    const cart = await this.cartService.getOrCreateCart({ userId, sessionId });
    return this.cartService.addItem(cart.id, body.variantId, body.quantity || 1);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update item quantity in shopping bag' })
  async updateItemQuantity(
    @Req() req: Request,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
    @Headers('x-session-id') sessionHeader?: string,
  ) {
    const { userId, sessionId } = this.extractCartIdentity(req, sessionHeader);
    const cart = await this.cartService.getOrCreateCart({ userId, sessionId });
    return this.cartService.updateItemQuantity(cart.id, itemId, quantity);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from shopping bag' })
  async removeItem(
    @Req() req: Request,
    @Param('itemId') itemId: string,
    @Headers('x-session-id') sessionHeader?: string,
  ) {
    const { userId, sessionId } = this.extractCartIdentity(req, sessionHeader);
    const cart = await this.cartService.getOrCreateCart({ userId, sessionId });
    return this.cartService.removeItem(cart.id, itemId);
  }

  @Post('coupon')
  @ApiOperation({ summary: 'Apply luxury promotional voucher to shopping bag' })
  async applyCoupon(
    @Req() req: Request,
    @Body('code') code: string,
    @Headers('x-session-id') sessionHeader?: string,
  ) {
    const { userId, sessionId } = this.extractCartIdentity(req, sessionHeader);
    const cart = await this.cartService.getOrCreateCart({ userId, sessionId });
    return this.cartService.applyCoupon(cart.id, code);
  }

  @Delete('coupon')
  @ApiOperation({ summary: 'Remove applied voucher from shopping bag' })
  async removeCoupon(@Req() req: Request, @Headers('x-session-id') sessionHeader?: string) {
    const { userId, sessionId } = this.extractCartIdentity(req, sessionHeader);
    const cart = await this.cartService.getOrCreateCart({ userId, sessionId });
    return this.cartService.removeCoupon(cart.id);
  }
}
