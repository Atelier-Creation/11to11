import { Injectable, Inject } from '@nestjs/common';
import { ISearchProvider, SEARCH_PROVIDER_TOKEN } from './search.interface';
import { SearchQueryDto } from '@11-11/types';

@Injectable()
export class SearchService {
  constructor(
    @Inject(SEARCH_PROVIDER_TOKEN)
    private readonly searchProvider: ISearchProvider,
  ) {}

  async searchProducts(query: SearchQueryDto) {
    return this.searchProvider.searchProducts(query);
  }

  async getSuggestions(term: string) {
    return this.searchProvider.getSuggestions(term);
  }
}
