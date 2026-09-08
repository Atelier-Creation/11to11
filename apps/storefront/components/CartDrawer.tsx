'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@11-11/ui';

interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variant: {
    colorName: string;
    size: string;
    sku: string;
  };
  product: {
    title: string;
    slug: string;
    primaryImage?: { url: string; altText?: string };
  };
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  appliedCoupon?: string;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onApplyCoupon: (code: string) => Promise<void>;
  onRemoveCoupon: () => Promise<void>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discountAmount,
  shippingFee,
  grandTotal,
  appliedCoupon,
  onUpdateQuantity,
  onRemoveItem,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      await onApplyCoupon(couponInput.trim());
      setCouponInput('');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid promotion voucher');
    } finally {
      setCouponLoading(false);
    }
  };

  const freeShippingThreshold = 25000;
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Slide-over Drawer Panel */}
      <aside className="drawer-panel" aria-label="Shopping Bag Drawer">
        {/* Drawer Header */}
        <div style={{
          padding: '24px 30px',
          borderBottom: '1px solid #E8E3DA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: 0,
            }}>
              Your 11 to 11 Bag
            </h2>
            <p style={{ fontSize: '11px', color: '#8A847C', letterSpacing: '0.1em', marginTop: '3px' }}>
              {items.length} {items.length === 1 ? 'Garment' : 'Garments'} Selected
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '6px', color: '#111' }} aria-label="Close Bag">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{
          backgroundColor: '#F7F5F0',
          padding: '12px 30px',
          fontSize: '11px',
          color: '#444',
          borderBottom: '1px solid #E8E3DA',
        }}>
          {remainingForFreeShipping === 0 ? (
            <span style={{ color: '#2E7D32', fontWeight: 500 }}>
              ✦ You have unlocked Complimentary White-Glove Insured Delivery
            </span>
          ) : (
            <span>
              Add <strong>{formatCurrency(remainingForFreeShipping)}</strong> to unlock Complimentary Insured Delivery
            </span>
          )}
        </div>

        {/* Cart Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#8A847C' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '8px' }}>
                Your bag is currently empty
              </p>
              <p style={{ fontSize: '12px', marginBottom: '24px' }}>
                Explore our signature tailoring and handcrafted silk capsules.
              </p>
              <button onClick={onClose} className="btn-luxury-outline" style={{ fontSize: '10px' }}>
                Discover Collections
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #EFEAE2',
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: '80px',
                  height: '105px',
                  backgroundColor: '#ECE7DF',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  {item.product.primaryImage ? (
                    <img
                      src={item.product.primaryImage.url}
                      alt={item.product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : null}
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '14px',
                      fontWeight: 500,
                      margin: '0 0 4px 0',
                    }}>
                      <Link href={`/products/${item.product.slug}`} onClick={onClose}>
                        {item.product.title}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '11px', color: '#8A847C', letterSpacing: '0.05em', margin: 0 }}>
                      {item.variant.colorName} / Size {item.variant.size}
                    </p>
                    <p style={{ fontSize: '10px', color: '#AAA', letterSpacing: '0.08em', marginTop: '2px' }}>
                      SKU: {item.variant.sku}
                    </p>
                  </div>

                  {/* Quantity & Price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '1px solid #D8D2C8',
                    }}>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '4px 8px', color: '#111' }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '11px', fontWeight: 500, padding: '0 8px' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '4px 8px', color: '#111' }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>
                        {formatCurrency(item.totalPrice)}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        style={{ color: '#9E968D', padding: '2px' }}
                        title="Remove garment"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Summary */}
        {items.length > 0 && (
          <div style={{
            padding: '24px 30px',
            backgroundColor: '#FAF9F5',
            borderTop: '1px solid #E8E3DA',
          }}>
            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="PROMO CODE (e.g. WELCOME11)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid #D8D2C8',
                  background: '#FFF',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={couponLoading}
                className="btn-luxury-outline"
                style={{ padding: '10px 18px', fontSize: '10px' }}
              >
                {couponLoading ? 'Applying...' : 'Apply'}
              </button>
            </form>

            {couponError && (
              <p style={{ fontSize: '11px', color: '#C62828', marginBottom: '10px' }}>
                {couponError}
              </p>
            )}

            {appliedCoupon && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 12px',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid #D4AF37',
                fontSize: '11px',
                marginBottom: '14px',
              }}>
                <span>Code <strong>{appliedCoupon}</strong> Applied</span>
                <button
                  type="button"
                  onClick={onRemoveCoupon}
                  style={{ color: '#111', fontSize: '10px', textDecoration: 'underline' }}
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6E6862' }}>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32' }}>
                  <span>Privilege Discount</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6E6862' }}>White-Glove Delivery</span>
                <span>{shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid #E8E3DA',
                paddingTop: '10px',
                marginTop: '4px',
                fontSize: '14px',
                fontWeight: 600,
              }}>
                <span>Estimated Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-luxury-dark"
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              Proceed to 11 to 11 Checkout
            </Link>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '12px',
              fontSize: '10px',
              color: '#8A847C',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              <ShieldCheck size={13} color="#D4AF37" />
              15-Minute Reserved Stock Protection Guaranteed
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
