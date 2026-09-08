'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@11-11/ui';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { EmptyState } from '../../components/StateViews';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem, openCart } = useCart();

  const handleMoveToBag = async (product: any) => {
    const size = product.sizes?.[0] || 'M';
    const color = product.colors?.[0]?.name || 'Standard';
    const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200';

    await addItem({
      variantId: `sku-${product.id}-${size}`,
      quantity: 1,
      title: product.title,
      slug: product.slug,
      sku: `1111-${product.slug.slice(0, 3).toUpperCase()}-${size}`,
      colorName: color,
      size,
      price: product.price,
      imageUrl: primaryImage,
    });
    removeFromWishlist(product.id);
    openCart();
  };

  if (wishlist.length === 0) {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '96px 24px' }}>
        <EmptyState
          title="Your Wishlist is Empty"
          description="Save your favored runway pieces and limited edition silhouettes to curate your personal seasonal collection."
          actionText="Browse Current Lookbook"
          actionHref="/collections"
          icon={<Heart size={24} />}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 24px 96px 24px' }}>
      {/* Page Title */}
      <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--border-light)', marginBottom: '40px' }}>
        <h1
          data-aos="fade-up"
          data-aos-delay="60"
          className="font-serif"
          style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 500 }}
        >
          Your Saved Runway Pieces
        </h1>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
          {wishlist.length} {wishlist.length === 1 ? 'Garment' : 'Garments'} saved in your 11 to 11 wishlist
        </span>
      </div>

      {/* Grid of Wishlist Items */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '32px 24px',
        }}
      >
        {wishlist.map((product) => {
          const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200';

          return (
            <div key={product.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)' }}>
              {/* 3:4 Portrait Box */}
              <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
                <Link href={`/products/${product.slug}`}>
                  <img
                    src={primaryImage}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  aria-label="Remove from wishlist"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    padding: '6px',
                    borderRadius: '50%',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Info & Action */}
              <div style={{ padding: '16px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {product.category?.name || '11 to 11'}
                </div>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-serif" style={{ fontSize: '15px', fontWeight: 500, marginBottom: '6px', lineHeight: 1.3 }}>
                    {product.title}
                  </h3>
                </Link>
                <div className="tabular-nums" style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>
                  {formatCurrency(product.price)}
                </div>

                <button
                  onClick={() => handleMoveToBag(product)}
                  className="btn-luxury-dark"
                  style={{ width: '100%', padding: '12px', fontSize: '11px' }}
                >
                  <ShoppingBag size={13} />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
