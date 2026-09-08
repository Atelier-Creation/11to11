'use client';

import React from 'react';

export const CollectionsHero: React.FC = () => {
  return (
    <section
      className="collections-hero-container"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#FAF8F4',
        borderBottom: '1px solid var(--border-light)',
        marginBottom: '44px',
        padding: '36px 0 44px 0',
        overflow: 'hidden',
      }}
      aria-label="Collections Editorial Introduction"
    >
      <div
        className="collections-hero-content"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          position: 'relative',
        }}
      >
        {/* Left Section: Eyebrow, Title, Subtitle, and Metrics */}
        <div
          className="collections-hero-left"
          style={{
            flex: '1 1 480px',
            maxWidth: '540px',
            zIndex: 2,
          }}
        >
          {/* Eyebrow */}
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '16px',
            }}
          >
            CURATED EDITIONS
          </span>

          {/* Headline */}
          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(38px, 4.4vw, 56px)',
              fontWeight: 400,
              color: '#111111',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: '0 0 18px 0',
            }}
          >
            The 11 to 11 Collections
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '14px',
              color: '#555555',
              lineHeight: 1.68,
              margin: '0 0 36px 0',
              maxWidth: '470px',
            }}
          >
            Each capsule is designed around singular artisanal weaving traditions,
            producing limited editions that celebrate architectural drape and tactile purity.
          </p>

          {/* Metrics Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            <div>
              <div
                className="font-serif"
                style={{
                  fontSize: '38px',
                  fontWeight: 400,
                  color: '#111111',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                06
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#666666',
                  marginTop: '6px',
                  letterSpacing: '0.02em',
                }}
              >
                Curated Collections
              </div>
            </div>

            <div
              style={{
                width: '1px',
                height: '42px',
                backgroundColor: '#D8D2C7',
              }}
            />

            <div>
              <div
                className="font-serif"
                style={{
                  fontSize: '38px',
                  fontWeight: 400,
                  color: '#111111',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                100+
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#666666',
                  marginTop: '6px',
                  letterSpacing: '0.02em',
                }}
              >
                Artisanal Pieces
              </div>
            </div>
          </div>
        </div>

        {/* Center Section: Model Portrait with Soft Seamless Gradient Vignette */}
        <div
          className="collections-hero-center"
          style={{
            flex: '1 1 420px',
            maxWidth: '460px',
            height: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              maskImage:
                'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            }}
          >
            <img
              src="/collections-hero-model.jpg"
              alt="11 to 11 Collections Editorial Model"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* Right Section: Italic Editorial Motto */}
        <div
          className="collections-hero-right"
          style={{
            flex: '0 0 200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingLeft: '16px',
            zIndex: 2,
          }}
        >
          <p
            className="font-serif"
            style={{
              fontSize: 'clamp(18px, 1.8vw, 24px)',
              fontStyle: 'italic',
              lineHeight: 1.4,
              color: '#333333',
              fontWeight: 400,
              margin: 0,
            }}
          >
            More
            <br />
            than fashion,
            <br />
            a continuing
            <br />
            conversation.
          </p>

          <div
            style={{
              width: '32px',
              height: '1px',
              backgroundColor: '#555555',
              marginTop: '18px',
            }}
          />
        </div>
      </div>

      {/* Responsive Adaptation Styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .collections-hero-content {
            flex-wrap: wrap;
            justifyContent: center;
          }
          .collections-hero-center {
            order: 2;
            max-width: 380px;
            height: 360px;
          }
          .collections-hero-right {
            order: 3;
            flex: 0 0 100%;
            align-items: center;
            text-align: center;
            padding-left: 0;
            margin-top: 16px;
          }
          .collections-hero-right div {
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 768px) {
          .collections-hero-left {
            text-align: center;
          }
          .collections-hero-left div {
            justify-content: center;
          }
          .collections-hero-center {
            height: 300px;
            max-width: 300px;
          }
        }
      `}</style>
    </section>
  );
};
