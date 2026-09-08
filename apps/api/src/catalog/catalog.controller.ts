import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Gender, Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  @ApiOperation({ summary: 'List luxury products with pagination, category and collection filters' })
  async getProducts(
    @Query('categorySlug') categorySlug?: string,
    @Query('collectionSlug') collectionSlug?: string,
    @Query('gender') gender?: Gender,
    @Query('isFeatured') isFeatured?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: 'price_asc' | 'price_desc' | 'newest',
  ) {
    return this.catalogService.getProducts({
      categorySlug,
      collectionSlug,
      gender,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 12,
      sortBy,
    });
  }

  @Get('products/:slug')
  @ApiOperation({ summary: 'Get full product details, variants, images, and reviews by slug' })
  async getProductBySlug(@Param('slug') slug: string) {
    return this.catalogService.getProductBySlug(slug);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all garment categories with product counts' })
  async getCategories() {
    return this.catalogService.getCategories();
  }

  @Get('categories/:slug')
  @ApiOperation({ summary: 'Get category details by slug' })
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.catalogService.getCategoryBySlug(slug);
  }

  @Get('collections')
  @ApiOperation({ summary: 'List curated editorial collections and lookbooks' })
  async getCollections() {
    return this.catalogService.getCollections();
  }

  @Get('collections/:slug')
  @ApiOperation({ summary: 'Get collection details by slug' })
  async getCollectionBySlug(@Param('slug') slug: string) {
    return this.catalogService.getCollectionBySlug(slug);
  }

  @Post('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.MERCHANDISER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product with full variant matrix (Staff only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async createProduct(@Body() dto: CreateProductDto) {
    return this.catalogService.createProduct(dto);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete product by ID (Admin only)' })
  async deleteProduct(@Param('id') id: string) {
    return this.catalogService.deleteProduct(id);
  }
}
