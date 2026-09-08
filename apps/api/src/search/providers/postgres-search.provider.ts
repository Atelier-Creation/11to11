import { Injectable } from '@nestjs/common';
import { ISearchProvider } from '../search.interface';
import { SearchQueryDto, PaginatedResult } from '@11-11/types';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PostgresSearchProvider implements ISearchProvider {
  constructor(private readonly prisma: PrismaService) {}

  async searchProducts(query: SearchQueryDto): Promise<PaginatedResult<any>> {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    // Keyword search across title, description, and material
    if (query.q && query.q.trim().length > 0) {
      const searchTerm = query.q.trim();
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { material: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (query.categorySlug) {
      where.category = { slug: query.categorySlug };
    }

    if (query.collectionSlug) {
      where.collection = { slug: query.collectionSlug };
    }

    if (query.gender) {
      where.gender = query.gender;
    }

    // Variant filters (Color, Size, Price range)
    const variantWhere: any = {};

    if (query.colors && query.colors.length > 0) {
      variantWhere.colorName = { in: query.colors };
    }

    if (query.sizes && query.sizes.length > 0) {
      variantWhere.size = { in: query.sizes };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      variantWhere.price = {};
      if (query.minPrice !== undefined) {
        variantWhere.price.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        variantWhere.price.lte = query.maxPrice;
      }
    }

    if (Object.keys(variantWhere).length > 0) {
      where.variants = { some: variantWhere };
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          collection: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' } },
          variants: {
            include: {
              inventoryItems: true,
            },
          },
        },
      }),
    ]);

    const formattedItems = products.map((p) => {
      const formattedVariants = p.variants.map((v) => {
        const totalStock = v.inventoryItems.reduce((acc, item) => acc + item.quantityOnHand, 0);
        const reservedStock = v.inventoryItems.reduce((acc, item) => acc + item.reservedQuantity, 0);
        const available = Math.max(totalStock - reservedStock, 0);
        const { inventoryItems, ...rest } = v;
        return {
          ...rest,
          price: Number(v.price),
          compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
          availableQuantity: available,
        };
      });

      return {
        ...p,
        variants: formattedVariants,
      };
    });

    return {
      items: formattedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSuggestions(term: string): Promise<string[]> {
    if (!term || term.trim().length < 2) return [];

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        title: { contains: term.trim(), mode: 'insensitive' },
      },
      take: 6,
      select: { title: true },
    });

    return products.map((p) => p.title);
  }
}
