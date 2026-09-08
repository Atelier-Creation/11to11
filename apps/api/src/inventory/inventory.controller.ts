import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.MERCHANDISER, Role.FULFILLMENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get stock overview with low-stock alerts across warehouses (Staff only)' })
  async getOverview() {
    return this.inventoryService.getInventoryOverview();
  }

  @Post('adjust')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.FULFILLMENT)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually adjust stock balance for a variant in a warehouse' })
  async adjustStock(
    @Body() body: { variantId: string; warehouseId: string; quantityOnHand: number },
  ) {
    return this.inventoryService.adjustStock(
      body.variantId,
      body.warehouseId,
      body.quantityOnHand,
    );
  }

  @Post('cleanup-expired')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger cleanup of expired 15-minute checkout reservations' })
  async cleanupExpired() {
    return this.inventoryService.cleanupExpiredReservations();
  }
}
