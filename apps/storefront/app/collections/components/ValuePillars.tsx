'use client';

import React from 'react';
import { Truck, ShieldCheck, Phone, Gift } from 'lucide-react';

export const ValuePillars: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '28px',
        paddingTop: '20px',
      }}
      aria-label="Client Assurance Pillars"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ color: 'var(--text-primary)' }}>
          <Truck size={24} strokeWidth={1.5} />
        </div>
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}
          >
            COMPLIMENTARY SHIPPING
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Insured white-glove courier across India
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ color: 'var(--text-primary)' }}>
          <ShieldCheck size={24} strokeWidth={1.5} />
        </div>
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}
          >
            CERTIFIED PROVENANCE
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Handcrafted pure mulberry silk &amp; cashmere
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ color: 'var(--text-primary)' }}>
          <Phone size={22} strokeWidth={1.5} />
        </div>
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}
          >
            11 TO 11 CLIENT CARE
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Dedicated styling consultation
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ color: 'var(--text-primary)' }}>
          <Gift size={24} strokeWidth={1.5} />
        </div>
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}
          >
            EXCLUSIVE PACKAGING
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Signature 11 to 11 presentation
          </div>
        </div>
      </div>
    </div>
  );
};
