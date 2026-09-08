'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CatalogProduct } from '../../services/catalog.service';
import { ProductCard } from '../ProductCard';
import { ProductGridSkeleton } from '../StateViews';

interface EditorialNewArrivalsProps {
  products: CatalogProduct[];
  loading: boolean;
}

export const EditorialNewArrivals: React.FC<EditorialNewArrivalsProps> = ({ products, loading }) => {
  return (
    <section
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
        padding: '96px 24px',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '44px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <span
              data-aos="fade-up"
              data-aos-delay="50"
              style={{
                fontSize: '10px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold-dark)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Limited 11 to 11 Drop
            </span>
            <h2
              data-aos="fade-up"
              data-aos-delay="120"
              className="font-serif"
              style={{
                fontSize: 'clamp(26px, 3.8vw, 36px)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Featured Runway Arrivals
            </h2>
          </div>

          <Link
            href="/collections"
            data-aos="fade-up"
            data-aos-delay="140"
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-primary)',
              fontWeight: 600,
              paddingBottom: '2px',
              borderBottom: '1px solid var(--text-primary)',
            }}
          >
            <span>View Full Lookbook</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Balanced 4-Column Ecommerce Grid (Commercial, Fast, Easy to Shop) */}
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '32px 24px',
            }}
          >
            {products.slice(0, 4).map((p, idx) => (
              <div
                key={p.id}
                data-aos="fade-up"
                data-aos-delay={(idx % 4) * 80 + 80}
              >
                <ProductCard product={p} priority={idx < 2} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
