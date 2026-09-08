import React from 'react';

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary, #FAF8F4)',
      }}
    >
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div
          className="font-serif"
          style={{
            fontSize: '22px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--text-primary, #111111)',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          11 TO 11
        </div>

        <div
          style={{
            width: '100px',
            height: '1px',
            backgroundColor: 'var(--accent-gold, #D4AF37)',
            margin: '0 auto 16px auto',
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        />

        <div
          style={{
            fontSize: '10px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary, #777777)',
            fontWeight: 500,
          }}
        >
          CURATING ATELIER
        </div>
      </div>
    </div>
  );
}
