import React from 'react';

export default function CollectionsLoading() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF8F4',
      }}
    >
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div
          className="font-serif"
          style={{
            fontSize: '22px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#111111',
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
            backgroundColor: '#D4AF37',
            margin: '0 auto 16px auto',
            opacity: 0.8,
          }}
        />

        <div
          style={{
            fontSize: '10px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#666666',
            fontWeight: 500,
          }}
        >
          PREPARING COLLECTIONS
        </div>
      </div>
    </div>
  );
}
