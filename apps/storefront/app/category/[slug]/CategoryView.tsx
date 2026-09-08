'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../../../components/ProductCard';
import { CatalogProduct } from '../../../services/catalog.service';
import { EmptyState } from '../../../components/StateViews';

interface CategoryViewProps {
  slug: string;
  collectionParam?: string;
  initialProducts: CatalogProduct[];
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  slug,
  collectionParam,
  initialProducts,
}) => {
  // Filters state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');

  // Derive filtered and sorted products synchronously in-memory (0ms lag)
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by sizes
    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes?.some((s) => selectedSizes.includes(s)));
    }

    // Filter by colors
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors?.some((c) => selectedColors.includes(c.name))
      );
    }

    // Filter by price
    if (selectedPriceRange === 'under-40k') {
      result = result.filter((p) => p.price < 40000);
    } else if (selectedPriceRange === '40k-60k') {
      result = result.filter((p) => p.price >= 40000 && p.price <= 60000);
    } else if (selectedPriceRange === 'above-60k') {
      result = result.filter((p) => p.price > 60000);
    }

    // Sort
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [initialProducts, selectedSizes, selectedColors, selectedPriceRange, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedPriceRange('all');
  };

  const formatCategoryTitle = (catSlug: string) => {
    if (collectionParam) {
      return collectionParam
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    if (catSlug === 'all') return 'The Full 11 to 11 Collection';
    return catSlug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];
  const availableColors = [
    { name: 'Onyx Black', hex: '#111111' },
    { name: 'Chalk White', hex: '#EAE6DF' },
    { name: 'Champagne Gold', hex: '#E5D3B3' },
    { name: 'Camel Melange', hex: '#C19A6B' },
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px 80px 24px' }}>
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumbs"
        style={{
          display: 'flex',
          gap: '8px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginBottom: '28px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
        <span>/</span>
        <Link href="/collections" style={{ color: 'var(--text-secondary)' }}>Collections</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
          {formatCategoryTitle(slug)}
        </span>
      </nav>

      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}
          >
            {formatCategoryTitle(slug)}
          </h1>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
            {filteredProducts.length} Garments available
          </span>
        </div>

        {/* Sort & Mobile Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="btn-luxury-outline md:hidden"
            style={{ padding: '8px 16px', fontSize: '11px' }}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-light)',
                padding: '8px 12px',
                fontSize: '11px',
                letterSpacing: '0.1em',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="featured">Featured Curations</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Filter Sidebar + Products Grid */}
      <div style={{ display: 'flex', gap: '48px' }}>
        {/* Desktop Left Filter Rail */}
        <aside
          style={{
            width: '240px',
            flexShrink: 0,
            display: 'none',
          }}
          className="md:block"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>
              Refine By
            </span>
            {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedPriceRange !== 'all') && (
              <button
                onClick={clearAllFilters}
                style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'underline' }}
              >
                Reset
              </button>
            )}
          </div>

          {/* Filter: Price Range */}
          <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--border-light)', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>
              Price Range
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === 'all'}
                  onChange={() => setSelectedPriceRange('all')}
                />
                <span>All Prices</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === 'under-40k'}
                  onChange={() => setSelectedPriceRange('under-40k')}
                />
                <span>Under ₹40,000</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === '40k-60k'}
                  onChange={() => setSelectedPriceRange('40k-60k')}
                />
                <span>₹40,000 - ₹60,000</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === 'above-60k'}
                  onChange={() => setSelectedPriceRange('above-60k')}
                />
                <span>Above ₹60,000</span>
              </label>
            </div>
          </div>

          {/* Filter: Sizing */}
          <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--border-light)', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>
              11 to 11 Size
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '11px',
                    border: '1px solid',
                    borderColor: selectedSizes.includes(size) ? 'var(--text-primary)' : 'var(--border-light)',
                    backgroundColor: selectedSizes.includes(size) ? 'var(--text-primary)' : '#FFFFFF',
                    color: selectedSizes.includes(size) ? '#FFFFFF' : 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Color Palette */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>
              Color Hue
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              {availableColors.map((col) => (
                <label key={col.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(col.name)}
                    onChange={() => toggleColor(col.name)}
                  />
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: col.hex,
                      border: '1px solid rgba(0,0,0,0.15)',
                    }}
                  />
                  <span>{col.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Product Grid Area */}
        <div style={{ flex: 1 }}>
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No Garments Match Selected Filters"
              description="Try adjusting your size, color, or price range filters to view other pieces from this collection."
              actionText="Reset All Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '32px 24px',
              }}
            >
              {filteredProducts.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
          <div className="drawer-backdrop" onClick={() => setMobileFilterOpen(false)} style={{ opacity: 1 }} />
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '85%',
              maxWidth: '360px',
              backgroundColor: '#FFFFFF',
              zIndex: 301,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-drawer)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span className="font-serif" style={{ fontSize: '18px', fontWeight: 600 }}>
                Filters
              </span>
              <button onClick={() => setMobileFilterOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {/* Mobile Price */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Price
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <label style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="radio"
                      name="m-price"
                      checked={selectedPriceRange === 'all'}
                      onChange={() => setSelectedPriceRange('all')}
                    />
                    <span>All Prices</span>
                  </label>
                  <label style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="radio"
                      name="m-price"
                      checked={selectedPriceRange === 'under-40k'}
                      onChange={() => setSelectedPriceRange('under-40k')}
                    />
                    <span>Under ₹40,000</span>
                  </label>
                  <label style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="radio"
                      name="m-price"
                      checked={selectedPriceRange === 'above-60k'}
                      onChange={() => setSelectedPriceRange('above-60k')}
                    />
                    <span>Above ₹60,000</span>
                  </label>
                </div>
              </div>

              {/* Mobile Size */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Sizes
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        border: '1px solid',
                        borderColor: selectedSizes.includes(size) ? '#111' : '#DDD',
                        backgroundColor: selectedSizes.includes(size) ? '#111' : '#FFF',
                        color: selectedSizes.includes(size) ? '#FFF' : '#111',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '12px' }}>
              <button
                onClick={clearAllFilters}
                className="btn-luxury-outline"
                style={{ flex: 1, padding: '12px' }}
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="btn-luxury-dark"
                style={{ flex: 1, padding: '12px' }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
