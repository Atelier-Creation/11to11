import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class CreateProductVariantDto {
  @ApiProperty({ example: '1111-DRS-BLK-S' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'Onyx Black' })
  @IsString()
  @IsNotEmpty()
  colorName: string;

  @ApiProperty({ example: '#111111' })
  @IsString()
  @IsNotEmpty()
  colorHex: string;

  @ApiProperty({ example: 'S' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ example: 48500 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 54000 })
  @IsNumber()
  @IsOptional()
  compareAtPrice?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  initialStock?: number;
}

export class CreateProductImageDto {
  @ApiProperty({ example: 'https://images.unsplash.com/photo-...' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 'products/trench-01.jpg' })
  @IsString()
  @IsNotEmpty()
  storageKey: string;

  @ApiPropertyOptional({ example: 'Sovereign Silk Trench Front View' })
  @IsString()
  @IsOptional()
  altText?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional({ example: 'Onyx Black' })
  @IsString()
  @IsOptional()
  colorName?: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'The Sovereign Silk Organza Trench' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'sovereign-silk-organza-trench' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'A masterpiece of sheer architectural tailoring...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'French seams throughout. Storm flaps.' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({ example: '100% Mulberry Silk Organza' })
  @IsString()
  @IsOptional()
  material?: string;

  @ApiPropertyOptional({ example: 'Dry clean only.' })
  @IsString()
  @IsOptional()
  careInstructions?: string;

  @ApiProperty({ enum: Gender, default: Gender.WOMEN })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ example: 'category-uuid-here' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ example: 'collection-uuid-here' })
  @IsString()
  @IsOptional()
  collectionId?: string;

  @ApiProperty({ type: [CreateProductVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];

  @ApiProperty({ type: [CreateProductImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images: CreateProductImageDto[];
}
