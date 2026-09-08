import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Gender } from '@11-11/types';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Faceted product search with filter criteria and text matches' })
  async search(
    @Query('q') q?: string,
    @Query('categorySlug') categorySlug?: string,
    @Query('collectionSlug') collectionSlug?: string,
    @Query('gender') gender?: Gender,
    @Query('color') color?: string,
    @Query('size') size?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'relevance',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.searchProducts({
      q,
      categorySlug,
      collectionSlug,
      gender,
      colors: color ? [color] : undefined,
      sizes: size ? [size] : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 12,
    });
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Instant search autocomplete query suggestions' })
  async getSuggestions(@Query('q') q: string) {
    return this.searchService.getSuggestions(q);
  }
}
