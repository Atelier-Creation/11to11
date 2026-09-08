import { SearchQueryDto, PaginatedResult, ProductDto } from '@11-11/types';

export interface ISearchProvider {
  searchProducts(query: SearchQueryDto): Promise<PaginatedResult<any>>;
  getSuggestions(term: string): Promise<string[]>;
}

export const SEARCH_PROVIDER_TOKEN = 'SEARCH_PROVIDER_TOKEN';
