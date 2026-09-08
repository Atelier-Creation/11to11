'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  Ruler,
  MapPin,
  ArrowRight,
  ZoomIn,
} from 'lucide-react';
import { formatCurrency } from '@11-11/ui';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { CatalogService, CatalogProduct } from '../../../services/catalog.service';
import { DeliveryService, DeliveryEstimate } from '../../../services/delivery.service';
import { ProductCard } from '../../../components/ProductCard';
import { EmptyState } from '../../../components/StateViews';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addItem, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Variant selections
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [addingToBag, setAddingToBag] = useState(false);

  // Interactive Lens Zoom
  const [isZooming, setIsZooming] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  // Size Guide Modal
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Pincode Estimator
  const [pincode, setPincode] = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState<DeliveryEstimate | null>(null);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  // Single-open collapsible accordion state
  const [activeAccordion, setActiveAccordion] = useState<'details' | 'material' | 'shipping' | null>(
    'details'
  );

  useEffect(() => {
    setLoading(true);
    CatalogService.getProductBySlug(slug).then((prod) => {
      if (prod) {
        setProduct(prod);
        setSelectedColor(prod.colors?.[0]?.name || '');
        setSelectedSize(prod.sizes?.[0] || 'M');
      }
      setLoading(false);
    });

    CatalogService.getProducts({ limit: 4 }).then((res) => {
      setRelatedProducts(res.items.filter((p) => p.slug !== slug).slice(0, 3));
    });
  }, [slug]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomCoords({ x, y });
  };

  const toggleAccordion = (key: 'details' | 'material' | 'shipping') => {
    setActiveAccordion((prev) => (prev === key ? null : key));
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
          <div className="skeleton" style={{ width: '100%', aspectRatio: '3/4' }} />
          <div>
            <div className="skeleton" style={{ width: '30%', height: '14px', marginBottom: '16px' }} />
            <div className="skeleton" style={{ width: '80%', height: '32px', marginBottom: '16px' }} />
            <div className="skeleton" style={{ width: '25%', height: '24px', marginBottom: '32px' }} />
            <div className="skeleton" style={{ width: '100%', height: '48px', marginBottom: '16px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '80px 24px' }}>
        <EmptyState
          title="Garment Not Found"
          description="The requested piece may have concluded its limited edition cycle or been archived."
          actionText="Explore Current Runway"
          actionHref="/collections"
        />
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const primaryImage = product.images?.[activeImageIndex]?.url || product.images?.[0]?.url;

  const handleAddToCart = async () => {
    setAddingToBag(true);
    try {
      await addItem({
        variantId: `sku-${product.id}-${selectedSize}`,
        quantity: 1,
        title: product.title,
        slug: product.slug,
        sku: `1111-${product.slug.slice(0, 3).toUpperCase()}-${selectedSize}`,
        colorName: selectedColor || 'Standard',
        size: selectedSize,
        price: product.price,
        imageUrl: primaryImage,
      });
      openCart();
    } finally {
      setTimeout(() => setAddingToBag(false), 400);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/checkout');
  };

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeError(null);
    setDeliveryEstimate(null);
    setPincodeLoading(true);

    try {
      const estimate = await DeliveryService.getDeliveryEstimate(pincode);
      setDeliveryEstimate(estimate);
    } catch (err: any) {
      setPincodeError(err.message || 'Invalid postal pincode');
    } finally {
      setPincodeLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px 80px 24px' }}>
      {/* Product Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            image: product.images.map((img) => img.url),
            description: product.description,
            brand: {
              '@type': 'Brand',
              name: '11to11',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: product.price,
              availability: 'https://schema.org/InStock',
              seller: {
                '@type': 'Organization',
                name: '11 to 11',
              },
            },
          }),
        }}
      />

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
        <Link href={`/category/${product.category.slug}`} style={{ color: 'var(--text-secondary)' }}>
          {product.category.name}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{product.title}</span>
      </nav>

      {/* Main Grid: Gallery Left + Sticky Purchase Details Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '56px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Product Gallery with Refined Hover Zoom */}
        <div data-aos="fade-up" data-aos-delay="60">
          {/* Main Display Image with Lens Zoom */}
          <div
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
            style={{
              position: 'relative',
              aspectRatio: '3/4',
              width: '100%',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-secondary)',
              marginBottom: '16px',
              cursor: isZooming ? 'zoom-in' : 'default',
            }}
          >
            <img
              src={primaryImage}
              alt={product.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                transform: isZooming ? 'scale(1.75)' : 'scale(1)',
                transition: isZooming ? 'transform 0.08s ease-out' : 'transform 0.35s ease-out',
              }}
            />
            {product.badge && (
              <div style={{ position: 'absolute', top: '16px', left: '16px', pointerEvents: 'none' }}>
                <span className="badge-noir">{product.badge}</span>
              </div>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isWished ? '#B91C1C' : '#111111',
                zIndex: 10,
              }}
            >
              <Heart size={18} fill={isWished ? '#B91C1C' : 'none'} />
            </button>
          </div>

          {/* Gallery Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '72px',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: activeImageIndex === idx ? 'var(--text-primary)' : 'var(--border-light)',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease, opacity 0.2s ease',
                    opacity: activeImageIndex === idx ? 1 : 0.7,
                  }}
                >
                  <img src={img.url} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Purchase Details Rail */}
        <div data-aos="fade-up" data-aos-delay="120" style={{ position: 'sticky', top: '90px' }}>
          {/* Eyebrow */}
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold-dark)',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            {product.collection?.name || product.category.name}
          </div>

          {/* Garment Title */}
          <h1
            data-aos="fade-up"
            data-aos-delay="60"
            className="font-serif"
            style={{
              fontSize: 'clamp(28px, 3.5vw, 38px)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              marginBottom: '14px',
            }}
          >
            {product.title}
          </h1>

          {/* Price & GST Line */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
            <span
              className="tabular-nums"
              style={{
                fontSize: '24px',
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
                  fontSize: '15px',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through',
                }}
              >
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Price inclusive of all Indian taxes &amp; GST. Free insured delivery included.
          </div>

          {/* Short Narrative */}
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              paddingBottom: '24px',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '24px',
            }}
          >
            {product.description}
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Color: <strong style={{ color: 'var(--text-primary)' }}>{selectedColor}</strong>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      border: '2px solid',
                      borderColor: selectedColor === c.name ? 'var(--text-primary)' : 'transparent',
                      outline: selectedColor === c.name ? '1px solid var(--text-primary)' : '1px solid var(--border-light)',
                      outlineOffset: '2px',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection & Size Guide */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Select Size
              </span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                <Ruler size={13} />
                <span>Size Guide</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {(product.sizes || ['S', 'M', 'L']).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  style={{
                    minWidth: '52px',
                    height: '44px',
                    padding: '0 14px',
                    fontSize: '12px',
                    fontWeight: 500,
                    border: '1px solid',
                    borderColor: selectedSize === s ? 'var(--text-primary)' : 'var(--border-light)',
                    backgroundColor: selectedSize === s ? 'var(--text-primary)' : '#FFFFFF',
                    color: selectedSize === s ? '#FFFFFF' : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Conversion Purchase CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            <button
              onClick={handleAddToCart}
              disabled={addingToBag}
              className="btn-luxury-dark"
              style={{ width: '100%', padding: '18px 24px', fontSize: '12px' }}
            >
              <span>{addingToBag ? 'Adding to Bag...' : 'Add to Bag'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="btn-luxury-outline"
              style={{ width: '100%', padding: '16px 24px', fontSize: '12px' }}
            >
              <span>Order with 11 to 11 Privilege</span>
            </button>
          </div>

          {/* Pincode Delivery Estimator */}
          <div
            style={{
              padding: '20px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <MapPin size={14} color="var(--accent-gold-dark)" />
              <span>Indian Pincode Delivery Estimate</span>
            </div>
            <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Enter 6-digit postal code (e.g. 110001)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="input-editorial"
                style={{ height: '42px', fontSize: '12px' }}
              />
              <button
                type="submit"
                disabled={pincodeLoading}
                className="btn-luxury-dark"
                style={{ height: '42px', padding: '0 20px', whiteSpace: 'nowrap', fontSize: '11px' }}
              >
                {pincodeLoading ? 'Checking...' : 'Check'}
              </button>
            </form>

            {pincodeError && (
              <div style={{ fontSize: '11px', color: 'var(--status-error)', marginTop: '8px' }}>
                {pincodeError}
              </div>
            )}

            {deliveryEstimate && (
              <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} />
                <span>{deliveryEstimate.message}</span>
              </div>
            )}
          </div>

          {/* Single-Open Collapsible Accordions with Height & Opacity Transitions */}
          <div style={{ borderTop: '1px solid var(--border-light)' }}>
            {/* Accordion 1: Details */}
            <div style={{ borderBottom: '1px solid var(--border-light)' }}>
              <button
                id="accordion-trigger-details"
                aria-expanded={activeAccordion === 'details'}
                aria-controls="accordion-panel-details"
                onClick={() => toggleAccordion('details')}
                style={{
                  width: '100%',
                  padding: '18px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                <span>The Silhouette &amp; Craftsmanship</span>
                {activeAccordion === 'details' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <div
                id="accordion-panel-details"
                role="region"
                aria-labelledby="accordion-trigger-details"
                style={{
                  display: 'grid',
                  gridTemplateRows: activeAccordion === 'details' ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
                  opacity: activeAccordion === 'details' ? 1 : 0,
                  overflow: 'hidden',
                }}
              >
                <div style={{ minHeight: 0, paddingBottom: activeAccordion === 'details' ? '16px' : 0 }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    {product.details || 'Tailored to perfection with architectural horn closures and French binding.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Accordion 2: Fabric & Loom */}
            <div style={{ borderBottom: '1px solid var(--border-light)' }}>
              <button
                id="accordion-trigger-material"
                aria-expanded={activeAccordion === 'material'}
                aria-controls="accordion-panel-material"
                onClick={() => toggleAccordion('material')}
                style={{
                  width: '100%',
                  padding: '18px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                <span>Material &amp; Care</span>
                {activeAccordion === 'material' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <div
                id="accordion-panel-material"
                role="region"
                aria-labelledby="accordion-trigger-material"
                style={{
                  display: 'grid',
                  gridTemplateRows: activeAccordion === 'material' ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
                  opacity: activeAccordion === 'material' ? 1 : 0,
                  overflow: 'hidden',
                }}
              >
                <div style={{ minHeight: 0, paddingBottom: activeAccordion === 'material' ? '16px' : 0 }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    <div><strong>Composition:</strong> {product.material || '100% Pure Mulberry Silk'}</div>
                    <div style={{ marginTop: '6px' }}><strong>Care:</strong> {product.careInstructions || 'Dry clean only by luxury garment specialist.'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion 3: Shipping & Returns */}
            <div style={{ borderBottom: '1px solid var(--border-light)' }}>
              <button
                id="accordion-trigger-shipping"
                aria-expanded={activeAccordion === 'shipping'}
                aria-controls="accordion-panel-shipping"
                onClick={() => toggleAccordion('shipping')}
                style={{
                  width: '100%',
                  padding: '18px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                <span>White-Glove Delivery &amp; 7-Day Exchange</span>
                {activeAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <div
                id="accordion-panel-shipping"
                role="region"
                aria-labelledby="accordion-trigger-shipping"
                style={{
                  display: 'grid',
                  gridTemplateRows: activeAccordion === 'shipping' ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
                  opacity: activeAccordion === 'shipping' ? 1 : 0,
                  overflow: 'hidden',
                }}
              >
                <div style={{ minHeight: 0, paddingBottom: activeAccordion === 'shipping' ? '16px' : 0 }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    Complimentary insured courier to all serviceable Indian pincodes. If the fit does not exceed your expectations, request a complimentary size exchange within 7 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '96px', paddingTop: '64px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span
              data-aos="fade-up"
              data-aos-delay="40"
              style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent-gold-dark)', fontWeight: 600 }}
            >
              Curated Wardrobe
            </span>
            <h2
              data-aos="fade-up"
              data-aos-delay="100"
              className="font-serif"
              style={{ fontSize: '28px', fontWeight: 500, marginTop: '6px' }}
            >
              Pair It With
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '28px',
            }}
          >
            {relatedProducts.map((rp, idx) => (
              <div
                key={rp.id}
                data-aos="fade-up"
                data-aos-delay={(idx % 4) * 80}
              >
                <ProductCard product={rp} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Purchase Bar */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-light)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          zIndex: 90,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600 }}>{formatCurrency(product.price)}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Selected: {selectedSize}</div>
        </div>
        <button
          onClick={handleAddToCart}
          className="btn-luxury-dark"
          style={{ flex: 1, padding: '12px 16px', fontSize: '11px' }}
        >
          Add to Bag
        </button>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400 }}>
          <div className="drawer-backdrop" onClick={() => setSizeGuideOpen(false)} style={{ opacity: 1 }} />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '560px',
              backgroundColor: '#FFFFFF',
              padding: '32px',
              zIndex: 401,
              border: '1px solid var(--border-light)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 500 }}>
                Size &amp; Fit Matrix
              </h3>
              <button onClick={() => setSizeGuideOpen(false)} style={{ padding: '4px' }} aria-label="Close size guide">
                ✕
              </button>
            </div>

            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '20px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '8px 0' }}>Size</th>
                  <th>Bust (Inches)</th>
                  <th>Waist (Inches)</th>
                  <th>Hips (Inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '8px 0' }}>XS (UK 6)</td>
                  <td>32 - 33</td>
                  <td>25 - 26</td>
                  <td>35 - 36</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '8px 0' }}>S (UK 8)</td>
                  <td>34 - 35</td>
                  <td>27 - 28</td>
                  <td>37 - 38</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '8px 0' }}>M (UK 10)</td>
                  <td>36 - 37</td>
                  <td>29 - 30</td>
                  <td>39 - 40</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '8px 0' }}>L (UK 12)</td>
                  <td>38 - 40</td>
                  <td>31 - 33</td>
                  <td>41 - 43</td>
                </tr>
              </tbody>
            </table>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Need bespoke measurements? Our 11 to 11 concierge provides complimentary personal fitting consultation via phone or WhatsApp.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
