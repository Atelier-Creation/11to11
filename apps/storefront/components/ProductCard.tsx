'use client';

import React, { useState } from 'react';
import { TransitionLink } from './motion/TransitionLink';
import { Heart } from 'lucide-react';
import { formatCurrency } from '@11-11/ui';
import { CatalogProduct } from '../services/catalog.service';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: CatalogProduct;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'M');
  const [addingSize, setAddingSize] = useState<string | null>(null);

  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200';
  const secondaryImage = product.images?.[1]?.url || primaryImage;
  const isWished = isInWishlist(product.id);

  const handleQuickAdd = async (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingSize(size);
    try {
      const color = product.colors?.[0]?.name || 'Standard';
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
    } finally {
      setTimeout(() => setAddingSize(null), 600);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: "10px" }}
    >
      {/* 3:4 Aspect Ratio Image Box (Locked to prevent CLS) */}
      <div className="product-image-container" style={{ borderRadius: "10px" }}>
        <TransitionLink
          href={`/products/${product.slug}`}
          transitionLabel="VIEWING GARMENT"
          aria-label={product.title}
        >
          <img
            src={hovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
            alt={product.title}
            loading={priority ? 'eager' : 'lazy'}
          />
        </TransitionLink>

        {/* Badge (Top-left) */}
        {product.badge && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5 }}>
            <span className="badge-noir">{product.badge}</span>
          </div>
        )}

        {/* Wishlist Button (Top-right) */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 5,
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease, transform 0.2s ease',
            color: isWished ? '#B91C1C' : '#111111',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart size={16} fill={isWished ? '#B91C1C' : 'none'} strokeWidth={1.75} />
        </button>

        {/* Quick Size Bar (Appears on Hover) */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="product-quick-add" style={{ borderRadius: '20px 20px 00px 0px' }}>
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                alignSelf: 'center',
                marginRight: '6px',

              }}
            >
              Quick Add:
            </span>
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={(e) => handleQuickAdd(e, s)}
                disabled={addingSize === s}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 500,
                  border: '1px solid var(--border-light)',
                  backgroundColor: addingSize === s ? '#111111' : '#FFFFFF',
                  color: addingSize === s ? '#FFFFFF' : '#111111',
                  transition: 'all 0.15s ease',
                }}
              >
                {addingSize === s ? '✓' : s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div style={{ paddingTop: '14px', paddingBottom: '6px' }}>
        {/* Category Eyebrow */}
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            marginBottom: '4px',
          }}
        >
          {product.category?.name || '11 to 11'}
        </div>

        {/* Product Title */}
        <TransitionLink href={`/products/${product.slug}`} transitionLabel="VIEWING GARMENT">
          <h3
            className="font-serif"
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.35,
              marginBottom: '6px',
              transition: 'color 0.2s ease',
            }}
          >
            {product.title}
          </h3>
        </TransitionLink>

        {/* Price Block with INR formatting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="tabular-nums"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {formatCurrency(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span
              className="tabular-nums"
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                textDecoration: 'line-through',
              }}
            >
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Color Swatch Dots */}
        {product.colors && product.colors.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
            {product.colors.map((c, idx) => (
              <span
                key={idx}
                title={c.name}
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: c.hex,
                  border: '1px solid rgba(0,0,0,0.15)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
