'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Instagram } from 'lucide-react';

export interface EditorialSocialPost {
  id: string;
  imageUrl: string;
  caption: string;
  collection: string;
}

const CURATED_LOOKS: EditorialSocialPost[] = [
  {
    id: 'look-1',
    imageUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    caption: 'The Sovereign Trench in fluid motion during Bombay private 11 to 11 preview.',
    collection: '11 to 11 Runway',
  },
  {
    id: 'look-2',
    imageUrl:
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
    caption: 'Champagne silk column gown styled with unpolished ancestral gold.',
    collection: 'Haute Eveningwear',
  },
  {
    id: 'look-3',
    imageUrl:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    caption: 'Raw Tussar silk drying in the winter morning mist of Chanderi.',
    collection: 'The Loom Series',
  },
  {
    id: 'look-4',
    imageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    caption: 'Architectural horn button detail and French seam precision.',
    collection: 'Sartorial Detail',
  },
  {
    id: 'look-5',
    imageUrl:
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
    caption: 'Double-faced Mongolian cashmere unlined coat in Camel Melange.',
    collection: 'Winter Noir',
  },
];

export const SocialEditorial: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '100px 24px',
      }}
      aria-label="Instagram Visual Journal"
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <span
            data-aos="fade-up"
            data-aos-delay="40"
            style={{
              fontSize: '10px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold-dark)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Curated Visual Journal
          </span>
          <h2
            data-aos="fade-up"
            data-aos-delay="100"
            className="font-serif"
            style={{
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            @11to11 on Instagram
          </h2>
        </div>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          data-aos="fade-up"
          data-aos-delay="120"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'var(--text-primary)',
            paddingBottom: '4px',
            borderBottom: '1px solid var(--text-primary)',
            transition: 'gap 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#9E8024')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        >
          <Instagram size={14} />
          <span>Follow 11 to 11</span>
          <ArrowUpRight size={14} />
        </a>
      </div>

      {/* 1:1 Square Grid (5 Equal Columns on Desktop) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {CURATED_LOOKS.map((look, idx) => {
          const isHovered = hoveredId === look.id;

          return (
            <a
              key={look.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              data-aos="fade-up"
              data-aos-delay={(idx % 5) * 80 + 80}
              onMouseEnter={() => setHoveredId(look.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                width: '100%',
                overflow: 'hidden',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-secondary)',
                display: 'block',
                textDecoration: 'none',
                isolation: 'isolate',
                transform: 'translateZ(0)',
                WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                maskImage: '-webkit-radial-gradient(white, black)',
              }}
              aria-label={`View ${look.collection} look on Instagram`}
            >
              {/* Square Image with Smooth Zoom */}
              <img
                src={look.imageUrl}
                alt={look.caption}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: isHovered ? 'scale(1.06)' : 'scale(1.0)',
                  transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                  borderRadius: '10px',
                  display: 'block',
                }}
              />

              {/* Gradient Vignette Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: isHovered
                    ? 'linear-gradient(0deg, rgba(17,17,17,0.85) 0%, rgba(17,17,17,0.3) 50%, rgba(17,17,17,0.1) 100%)'
                    : 'linear-gradient(0deg, rgba(17,17,17,0.7) 0%, rgba(17,17,17,0.15) 50%, rgba(17,17,17,0) 100%)',
                  transition: 'background 0.35s ease',
                  borderRadius: '10px',
                  pointerEvents: 'none',
                }}
              />

              {/* Instagram Icon Badge on Hover (Top Right) */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'rgba(17, 17, 17, 0.65)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: "10px",
                  color: '#FAF9F5',
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'scale(1)' : 'scale(0.85)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 2,
                }}
              >
                <Instagram size={16} color="#D4AF37" />
              </div>

              {/* Editorial Caption at Bottom of Square Tile */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '18px 16px',
                  color: '#FFFFFF',
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#D4AF37',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  {look.collection}
                </span>
                <p
                  style={{
                    fontSize: '11px',
                    lineHeight: 1.45,
                    color: 'rgba(250, 249, 245, 0.9)',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {look.caption}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
