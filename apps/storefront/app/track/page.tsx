'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatCurrency } from '@11-11/ui';
import { Search, CheckCircle, Clock, Truck, Package, MapPin, AlertCircle } from 'lucide-react';
import { OrderService, OrderResponse } from '../../services/order.service';
import { EmptyState, ErrorState } from '../../components/StateViews';

const LIFECYCLE_STAGES = [
  { key: 'PENDING', label: 'Order Created', icon: Clock },
  { key: 'CONFIRMED', label: 'Payment Confirmed', icon: CheckCircle },
  { key: 'PROCESSING', label: 'Tailoring & Inspection', icon: Package },
  { key: 'SHIPPED', label: 'Dispatched in Transit', icon: Truck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: MapPin },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

function TrackOrderInner() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || searchParams.get('ref') || '1111-2026-94812';

  const [searchInput, setSearchInput] = useState(initialOrderNumber);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = (num: string) => {
    setLoading(true);
    setError(null);
    OrderService.trackOrderByNumber(num)
      .then((res) => {
        setOrder(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Could not locate order reference.');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber);
    } else {
      setLoading(false);
    }
  }, [initialOrderNumber]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchOrder(searchInput.trim());
    }
  };

  // Helper to determine stage active index
  const getStageIndex = (status?: string) => {
    if (!status) return 1;
    const cleanStatus = status.toUpperCase();
    if (cleanStatus === 'PENDING' || cleanStatus === 'PENDING_PAYMENT') return 0;
    if (cleanStatus === 'CONFIRMED' || cleanStatus === 'PAID') return 1;
    if (cleanStatus === 'PROCESSING') return 2;
    if (cleanStatus === 'SHIPPED') return 3;
    if (cleanStatus === 'OUT_FOR_DELIVERY') return 4;
    if (cleanStatus === 'DELIVERED') return 5;
    return 1;
  };

  const isExceptionalStatus = (status?: string) => {
    return ['CANCELLED', 'PAYMENT_FAILED', 'REFUNDED', 'RETURN_REQUESTED', 'RETURNED'].includes(
      status?.toUpperCase() || ''
    );
  };

  const currentStageIndex = getStageIndex(order?.status);

  return (
    <div style={{ maxWidth: '960px', margin: '48px auto 96px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span
          style={{
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--accent-gold-dark)',
            fontWeight: 600,
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Client Concierge Service
        </span>
        <h1
          data-aos="fade-up"
          data-aos-delay="60"
          className="font-serif"
          style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 400 }}
        >
          Track Your 11 to 11 Order
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
          Enter your numbered order reference to view fulfillment and courier dispatch milestones.
        </p>
      </div>

      {/* Lookup Bar */}
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', maxWidth: '540px', margin: '0 auto 48px auto' }}>
        <input
          type="text"
          placeholder="ENTER ORDER REFERENCE (e.g. 1111-2026-94812)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
          className="input-editorial"
          style={{
            flex: 1,
            height: '48px',
            borderRight: 'none',
            fontSize: '11px',
            letterSpacing: '0.12em',
          }}
        />
        <button
          type="submit"
          className="btn-luxury-dark"
          style={{ height: '48px', padding: '0 24px', fontSize: '11px' }}
        >
          <Search size={14} />
          <span>Track</span>
        </button>
      </form>

      {/* Results State Machine */}
      {loading ? (
        <div className="skeleton" style={{ width: '100%', height: '360px' }} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchOrder(searchInput)} />
      ) : !order ? (
        <EmptyState
          title="Order Reference Not Found"
          description="Please check the reference number from your confirmation receipt or reach out to client concierge."
        />
      ) : (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)', padding: '36px' }}>
          {/* Order Header Summary */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: '16px',
              paddingBottom: '24px',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '32px',
            }}
          >
            <div>
              <span style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Order Number
              </span>
              <h2 className="font-serif" style={{ fontSize: '24px', fontWeight: 500, margin: '2px 0 0 0' }}>
                #{order.orderNumber}
              </h2>
            </div>

            <div>
              <span style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Fulfillment Status
              </span>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--status-success)', marginTop: '2px' }}>
                {order.status}
              </div>
            </div>

            {order.trackingCode && (
              <div>
                <span style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Courier Partner
                </span>
                <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>
                  {order.courierName || 'Insured White-Glove Logistics'} ({order.trackingCode})
                </div>
              </div>
            )}
          </div>

          {/* Exceptional Status Banner */}
          {isExceptionalStatus(order.status) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #F87171',
                color: '#991B1B',
                marginBottom: '32px',
                fontSize: '13px',
              }}
            >
              <AlertCircle size={18} />
              <div>
                Order status is <strong>{order.status}</strong>. If you have questions regarding payment resolution or return processing, our concierge is at your service.
              </div>
            </div>
          )}

          {/* Standard 6-Step Timeline */}
          {!isExceptionalStatus(order.status) && (
            <div style={{ marginBottom: '40px' }}>
              <h3
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  marginBottom: '24px',
                  fontWeight: 600,
                }}
              >
                Fulfillment Journey
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {LIFECYCLE_STAGES.map((stage, idx) => {
                  const isDone = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const Icon = stage.icon;

                  return (
                    <div key={stage.key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? '#111111' : 'var(--bg-secondary)',
                          color: isDone ? '#D4AF37' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: isCurrent ? 600 : isDone ? 500 : 400,
                            color: isDone ? 'var(--text-primary)' : 'var(--text-muted)',
                          }}
                        >
                          {stage.label}
                        </div>
                      </div>
                      {isCurrent && (
                        <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--status-success)', fontWeight: 600 }}>
                          Current Milestone
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
            <h3
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: '16px',
                fontWeight: 600,
              }}
            >
              Curated Pieces in this Dispatch
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} style={{ width: '48px', aspectRatio: '3/4', objectFit: 'cover' }} />
                  )}
                  <div style={{ flex: 1, fontSize: '13px' }}>
                    <div style={{ fontWeight: 500 }}>{item.title}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>
                      Size: {item.size} • Color: {item.colorName} • Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="tabular-nums" style={{ fontSize: '13px', fontWeight: 600 }}>
                    {formatCurrency(item.totalPrice)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>Loading tracker...</div>}>
      <TrackOrderInner />
    </Suspense>
  );
}
