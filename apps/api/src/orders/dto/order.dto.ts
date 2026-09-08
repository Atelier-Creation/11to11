import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentGateway } from '@prisma/client';

export class ShippingAddressDto {
  @ApiProperty({ example: 'Elena Rostova' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '+919812345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '42 Altamount Road, Cumballa Hill' })
  @IsString()
  @IsNotEmpty()
  streetLine1: string;

  @ApiPropertyOptional({ example: 'Penthouse B' })
  @IsString()
  @IsOptional()
  streetLine2?: string;

  @ApiProperty({ example: 'Mumbai' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Maharashtra' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '400026' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ example: 'IN' })
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'cart-uuid-here' })
  @IsString()
  @IsNotEmpty()
  cartId: string;

  @ApiProperty({ example: 'elena@atelier.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+919812345678' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ enum: PaymentGateway, default: PaymentGateway.RAZORPAY })
  @IsEnum(PaymentGateway)
  paymentGateway: PaymentGateway;

  @ApiPropertyOptional({ example: 'Complimentary signature gift wrap requested' })
  @IsString()
  @IsOptional()
  customerNote?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'SHIPPED' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ example: 'Dispatched via Delhivery Premium Secure' })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({ example: 'DLV9928174' })
  @IsString()
  @IsOptional()
  trackingCode?: string;

  @ApiPropertyOptional({ example: 'Delhivery' })
  @IsString()
  @IsOptional()
  courierName?: string;
}
