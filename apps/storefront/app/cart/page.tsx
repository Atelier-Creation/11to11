'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Lock } from 'lucide-react';
import { formatCurrency } from '@11-11/ui';
import { useCart } from '../../context/CartContext';
import { EmptyState } from '../../components/StateViews';

export default function CartPage() {
  const {
    items,
    subtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    appliedCoupon,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput('');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid promotional code');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '96px 24px' }}>
        <EmptyState
          title="Your Shopping Bag is Empty"
          description="You have not added any pieces to your shopping bag yet. Explore our curated runway collections."
          actionText="Explore Collections"
          actionHref="/collections"
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 24px 96px 24px' }}>
      {/* Title */}
      <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--border-light)', marginBottom: '40px' }}>
        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 500,
            color: 'var(--text-primary)',
          }}
        >
          Your Shopping Bag
        </h1>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
          {items.reduce((acc, i) => acc + i.quantity, 0)} Items reserved for checkout
        </span>
      </div>

      {/* Main Grid: Items Left (8-col) + Summary Right (4-col) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}
      >
        {/* Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '20px',
                paddingBottom: '24px',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              {/* Image 3:4 locked ratio */}
              <div
                style={{
                  width: '96px',
                  aspectRatio: '3/4',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-secondary)',
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.product.primaryImage?.url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000'}
                  alt={item.product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <Link href={`/products/${item.product.slug}`}>
                      <h3
                        className="font-serif"
                        style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3 }}
                      >
                        {item.product.title}
                      </h3>
                    </Link>
                    <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 600 }}>
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Color: {item.variant.colorName} • Size: {item.variant.size}
                  </div>
                </div>

                {/* Controls: Quantity Stepper & Remove */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '1px solid var(--border-light)',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}
                      style={{ padding: '6px 10px', color: 'var(--text-primary)' }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="tabular-nums" style={{ padding: '0 12px', fontSize: '12px', fontWeight: 600 }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ padding: '6px 10px', color: 'var(--text-primary)' }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-light)',
            padding: '32px',
          }}
        >
          <h2
            className="font-serif"
            style={{
              fontSize: '20px',
              fontWeight: 500,
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-light)',
            }}
          >
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Bag Subtotal</span>
              <span className="tabular-nums" style={{ fontWeight: 500 }}>
                {formatCurrency(subtotal)}
              </span>
            </div>

            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-success)' }}>
                <span>11 to 11 Privilege ({appliedCoupon})</span>
                <span className="tabular-nums">- {formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Insured White-Glove Delivery</span>
              <span style={{ color: 'var(--status-success)', fontWeight: 500 }}>
                {shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-light)', fontSize: '16px', fontWeight: 600 }}>
              <span>Total Amount</span>
              <span className="tabular-nums">{formatCurrency(grandTotal)}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Inclusive of all applicable Indian taxes &amp; GST.
            </div>
          </div>

          {/* Coupon Input */}
          <div style={{ marginBottom: '24px' }}>
            {appliedCoupon ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-secondary)',
                  fontSize: '12px',
                }}
              >
                <span>Code <strong>{appliedCoupon}</strong> active</span>
                <button onClick={removeCoupon} style={{ color: 'var(--status-error)', fontSize: '11px', textDecoration: 'underline' }}>
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Voucher or Privilege Code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="input-editorial"
                  style={{ height: '44px', fontSize: '12px' }}
                />
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="btn-luxury-outline"
                  style={{ height: '44px', padding: '0 16px', fontSize: '11px', whiteSpace: 'nowrap' }}
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>
            )}
            {couponError && (
              <div style={{ fontSize: '11px', color: 'var(--status-error)', marginTop: '6px' }}>
                {couponError}
              </div>
            )}
          </div>

          {/* Checkout CTA */}
          <Link href="/checkout" className="btn-luxury-dark" style={{ width: '100%', padding: '16px', fontSize: '12px' }}>
            <Lock size={14} />
            <span>Proceed to Checkout</span>
            <ArrowRight size={14} />
          </Link>

          {/* Trust Guarantees */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={14} color="var(--accent-gold-dark)" />
              <span>Encrypted 256-Bit SSL Checkout Security</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={14} color="var(--accent-gold-dark)" />
              <span>Insured Transit with Real-time Order Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
