'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon, X, ArrowRight } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import { CatalogService, CatalogProduct } from '../../services/catalog.service';
import { ProductGridSkeleton, EmptyState } from '../../components/StateViews';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const popularSearches = [
    'Silk Organza Trench',
    'Column Gown',
    'Cashmere Coat',
    'Raw Silk',
    'Tuxedo Blazer',
    'Chanderi Cape',
  ];

  const performSearch = (searchTerm: string) => {
    setLoading(true);
    setSearched(true);
    CatalogService.getProducts().then((res) => {
      const qLower = searchTerm.toLowerCase().trim();
      const filtered = res.items.filter((p) => {
        return (
          p.title.toLowerCase().includes(qLower) ||
          p.category.name.toLowerCase().includes(qLower) ||
          p.description.toLowerCase().includes(qLower) ||
          p.material?.toLowerCase().includes(qLower)
        );
      });
      setProducts(filtered);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 24px 80px 24px' }}>
      {/* Search Input Hero */}
      <div style={{ maxWidth: '720px', margin: '0 auto 48px auto', textAlign: 'center' }}>
        <h1
          data-aos="fade-up"
          data-aos-delay="60"
          className="font-serif"
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '24px',
          }}
        >
          Search The 11to11 Collection
        </h1>

        <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by silhouette, fabric, or keyword..."
            autoFocus
            className="input-editorial"
            style={{
              height: '56px',
              paddingLeft: '52px',
              paddingRight: '48px',
              fontSize: '15px',
            }}
          />
          <SearchIcon
            size={20}
            style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setProducts([]);
                setSearched(false);
              }}
              style={{
                position: 'absolute',
                right: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                padding: '4px',
              }}
              aria-label="Clear query"
            >
              <X size={18} />
            </button>
          )}
        </form>

        {/* Popular Searches Chips */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '18px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Popular:
          </span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => {
                setQuery(term);
                performSearch(term);
              }}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: '0px',
                cursor: 'pointer',
              }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results State Machine */}
      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : searched && products.length === 0 ? (
        <EmptyState
          title={`No results found for "${query}"`}
          description="We could not find any garments matching your query. Explore our latest autumn/winter arrivals or try different search terms."
          actionText="Browse All Collections"
          actionHref="/collections"
        />
      ) : searched && products.length > 0 ? (
        <div>
          <div style={{ marginBottom: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Found {products.length} {products.length === 1 ? 'garment' : 'garments'} matching &quot;{query}&quot;
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '32px 24px',
            }}
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
