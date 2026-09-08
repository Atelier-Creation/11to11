'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Truck, ShieldCheck } from 'lucide-react';

function CheckoutSuccessInner() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '1111-ORD-VERIFIED';

  return (
    <div style={{ maxWidth: '720px', margin: '64px auto 96px auto', padding: '0 24px', textAlign: 'center' }}>
      {/* Check Icon */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#111111',
          color: '#D4AF37',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
        }}
      >
        <CheckCircle2 size={36} />
      </div>

      <span
        style={{
          fontSize: '11px',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'var(--accent-gold-dark)',
          fontWeight: 600,
          display: 'block',
          marginBottom: '8px',
        }}
      >
        Acquisition Confirmed
      </span>

      <h1
        className="font-serif"
        style={{
          fontSize: 'clamp(32px, 4.5vw, 44px)',
          fontWeight: 400,
          marginBottom: '16px',
        }}
      >
        Thank you for your patronage.
      </h1>

      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
        Your order reference is <strong>#{orderNumber}</strong>. Our master tailors have received your garment specifications and are preparing insured white-glove packaging.
      </p>

      {/* Reference Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-light)',
          padding: '24px 32px',
          textAlign: 'left',
          marginBottom: '40px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Order Number:</span>
          <strong>#{orderNumber}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Fulfillment Stage:</span>
          <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>CONFIRMED</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Courier Method:</span>
          <span>Insured White-Glove Dispatch</span>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href={`/track?orderNumber=${encodeURIComponent(orderNumber)}`} className="btn-luxury-dark">
          <Truck size={14} />
          <span>Track Order Status</span>
          <ArrowRight size={14} />
        </Link>
        <Link href="/collections" className="btn-luxury-outline">
          <span>Continue Exploring</span>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>Loading confirmation...</div>}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}
