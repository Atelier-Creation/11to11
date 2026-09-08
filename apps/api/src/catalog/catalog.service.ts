import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Gender } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(params: {
    categorySlug?: string;
    collectionSlug?: string;
    gender?: Gender;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'newest';
  }) {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (params.categorySlug) {
      where.category = { slug: params.categorySlug };
    }
    if (params.collectionSlug) {
      where.collection = { slug: params.collectionSlug };
    }
    if (params.gender) {
      where.gender = params.gender;
    }
    if (params.isFeatured !== undefined) {
      where.isFeatured = params.isFeatured;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (params.sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          collection: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' } },
          variants: {
            select: {
              id: true,
              sku: true,
              colorName: true,
              colorHex: true,
              size: true,
              price: true,
              compareAtPrice: true,
              inventoryItems: {
                select: { quantityOnHand: true, reservedQuantity: true },
              },
            },
          },
        },
      }),
    ]);

    // Format available stock per variant
    const formattedProducts = products.map((p) => {
      const formattedVariants = p.variants.map((v) => {
        const totalStock = v.inventoryItems.reduce((acc, item) => acc + item.quantityOnHand, 0);
        const reservedStock = v.inventoryItems.reduce((acc, item) => acc + item.reservedQuantity, 0);
        const available = Math.max(totalStock - reservedStock, 0);
        const { inventoryItems, ...rest } = v;
        return { ...rest, availableQuantity: available };
      });

      return {
        ...p,
        variants: formattedVariants,
      };
    });

    return {
      items: formattedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        collection: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: {
          include: {
            inventoryItems: true,
          },
        },
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug '${slug}' not found in the atelier catalog`);
    }

    const formattedVariants = product.variants.map((v) => {
      const totalStock = v.inventoryItems.reduce((acc, item) => acc + item.quantityOnHand, 0);
      const reservedStock = v.inventoryItems.reduce((acc, item) => acc + item.reservedQuantity, 0);
      const available = Math.max(totalStock - reservedStock, 0);
      const { inventoryItems, ...rest } = v;
      return { ...rest, availableQuantity: available };
    });

    return {
      ...product,
      variants: formattedVariants,
    };
  }

  async getCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
        children: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category '${slug}' not found`);
    }
    return category;
  }

  async getCollections() {
    return this.prisma.collection.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { year: 'desc' },
    });
  }

  async getCollectionBySlug(slug: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!collection) {
      throw new NotFoundException(`Collection '${slug}' not found`);
    }
    return collection;
  }

  async createProduct(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(`A product with slug '${dto.slug}' already exists`);
    }

    // Default warehouse for initial inventory
    let defaultWarehouse = await this.prisma.warehouse.findFirst();
    if (!defaultWarehouse) {
      defaultWarehouse = await this.prisma.warehouse.create({
        data: {
          code: 'WH-MUMBAI-MAIN',
          name: 'Atelier Main Hub',
          city: 'Mumbai',
          state: 'Maharashtra',
        },
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          description: dto.description,
          details: dto.details,
          material: dto.material,
          careInstructions: dto.careInstructions,
          gender: dto.gender,
          isActive: dto.isActive ?? true,
          isFeatured: dto.isFeatured ?? false,
          categoryId: dto.categoryId,
          collectionId: dto.collectionId,
          images: {
            create: dto.images.map((img) => ({
              url: img.url,
              storageKey: img.storageKey,
              altText: img.altText,
              sortOrder: img.sortOrder ?? 0,
              isPrimary: img.isPrimary ?? false,
              colorName: img.colorName,
            })),
          },
        },
      });

      for (const v of dto.variants) {
        const variant = await tx.productVariant.create({
          data: {
            productId: product.id,
            sku: v.sku,
            colorName: v.colorName,
            colorHex: v.colorHex,
            size: v.size,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
          },
        });

        if (v.initialStock && v.initialStock > 0) {
          await tx.inventoryItem.create({
            data: {
              variantId: variant.id,
              warehouseId: defaultWarehouse.id,
              quantityOnHand: v.initialStock,
              reservedQuantity: 0,
            },
          });
        }
      }

      return product;
    });
  }

  async deleteProduct(id: string) {
    await this.prisma.product.delete({
      where: { id },
    });
    return { success: true, message: 'Product successfully removed from atelier catalog' };
  }
}
