import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PostgresSearchProvider } from './providers/postgres-search.provider';
import { SEARCH_PROVIDER_TOKEN } from './search.interface';

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    {
      provide: SEARCH_PROVIDER_TOKEN,
      useClass: PostgresSearchProvider,
    },
  ],
  exports: [SearchService],
})
export class SearchModule {}
