'use client';

import React from 'react';

export const PhilosophyBanner: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        alignItems: 'center',
        backgroundColor: 'var(--bg-secondary)',
        padding: '24px',
        marginBottom: '56px',
      }}
    >
      {/* Left: Soft Flowing Silk Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '180px',
          overflow: 'hidden',
          backgroundColor: '#EAE6DF',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200"
          alt="Silk Atelier Flowing Drapery"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* Right: Atelier Philosophy Quote */}
      <div style={{ textAlign: 'center', padding: '16px 24px' }}>
        <p
          className="font-serif"
          style={{
            fontSize: 'clamp(22px, 2.5vw, 32px)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.35,
            margin: '0 0 16px 0',
          }}
        >
          &ldquo;Distinct collections. A unified philosophy.&rdquo;
        </p>

        <div
          style={{
            width: '28px',
            height: '1px',
            backgroundColor: 'var(--text-primary)',
            margin: '0 auto 14px auto',
          }}
        />

        <span
          style={{
            fontSize: '10px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            fontWeight: 600,
          }}
        >
          THE 11 TO 11 ATELIER
        </span>
      </div>
    </div>
  );
};
