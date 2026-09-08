import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, OrderStatus } from '@prisma/client';
import { Request } from 'express';

@ApiTags('Orders & Fulfillment')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Place and confirm a luxury order from shopping bag' })
  @ApiResponse({ status: 201, description: 'Order confirmed and registered in atelier system' })
  async checkout(@Body() dto: CreateOrderDto, @Req() req: Request) {
    const userId = req.user?.['id'];
    return this.ordersService.createOrder(dto, userId);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current customer order history' })
  async getMyOrders(@Req() req: Request) {
    return this.ordersService.getCustomerOrders(req.user['id']);
  }

  @Get('track/:orderNumber')
  @ApiOperation({ summary: 'Public order tracking by luxury order reference number' })
  async trackOrder(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.getOrderByNumber(orderNumber);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.FULFILLMENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all orders with status filtering (Admin only)' })
  async getAdminOrders(
    @Query('status') status?: OrderStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.getAdminOrders({
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.FULFILLMENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status and assign courier tracking code (Staff only)' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(id, dto);
  }
}
