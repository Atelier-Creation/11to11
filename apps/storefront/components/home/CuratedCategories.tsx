'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryBlade {
  id: string;
  number: string;
  verticalTitle: string;
  subtitle: string;
  tagline: string;
  itemCount: string;
  href: string;
  imageUrl: string;
}

const CATEGORY_BLADES: CategoryBlade[] = [
  {
    id: 'outerwear',
    number: '01',
    verticalTitle: 'Outerwear',
    subtitle: 'Sculpted Trenches & Cashmere Coats',
    tagline: 'Razor-cut architectural silhouettes tailored from double-faced Mongolian cashmere and silk organza.',
    itemCount: '14 Pieces',
    href: '/category/tailored-outerwear',
    imageUrl:
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'eveningwear',
    number: '02',
    verticalTitle: 'Eveningwear',
    subtitle: 'Column Gowns & Architectural Drapes',
    tagline: 'Hand-pressed accordion pleats in heavy silk crepe with statuesque asymmetric drapes.',
    itemCount: '09 Pieces',
    href: '/category/eveningwear-gowns',
    imageUrl:
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'handcrafted-silk',
    number: '03',
    verticalTitle: 'Handcrafted Silk',
    subtitle: 'Pure Wild Tussar & Organza Weaves',
    tagline: 'Woven on generational wooden pit looms with hand-drawn silver zari selvedges.',
    itemCount: '18 Pieces',
    href: '/category/handcrafted-silk',
    imageUrl:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'tailored-suits',
    number: '04',
    verticalTitle: 'Tailored Suits',
    subtitle: 'Sartorial Power Suiting & Blazers',
    tagline: 'Sculpted shoulder lines with hand-finished French seams and natural carved horn closures.',
    itemCount: '11 Pieces',
    href: '/category/tailored-outerwear',
    imageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'cashmere',
    number: '05',
    verticalTitle: 'Cashmere',
    subtitle: 'Mongolian Thermal Knitwear & Wraps',
    tagline: '750 GSM Grade-A unblended Mongolian fibers engineered for weightless natural warmth.',
    itemCount: '07 Pieces',
    href: '/collections',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
  },
];

export const CuratedCategories: React.FC = () => {
  // On desktop, track which blade is currently hovered (default is column 0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  return (
    <section
      id="collections-accordion-section"
      style={{
        position: 'relative',
        backgroundColor: '#FAF9F5',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
        padding: '72px 0 0 0',
        overflow: 'hidden',
      }}
      aria-label="11 to 11 Collections"
    >
      {/* Section Header */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '44px',
        }}
      >
        <span
          data-aos="fade-up"
          data-aos-delay="40"
          style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--accent-gold-dark)',
            fontWeight: 600,
            display: 'block',
            marginBottom: '10px',
          }}
        >
          Sartorial Disciplines
        </span>
        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          className="font-serif"
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 500,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: '0 0 12px 0',
            lineHeight: 1.15,
          }}
        >
          Curated 11 to 11 Collections
        </h2>
        <p
          data-aos="fade-up"
          data-aos-delay="160"
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Five architectural capsules handcrafted from certified pure raw fibers, honoring generational weaving heritage.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP ACCORDION BLADES (>=1024px)                                       */}
      {/* 5 Vertical Expandable Image Slices matching the Milano Webflow Reference   */}
      {/* ========================================================================= */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="hidden md:flex"
        style={{
          width: '100%',
          height: '680px',
          maxHeight: '78vh',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          backgroundColor: '#111111',
        }}
        onMouseLeave={() => setHoveredIndex(0)}
      >
        {CATEGORY_BLADES.map((blade, idx) => {
          const isHovered = hoveredIndex === idx;

          // Compute dynamic flex ratio and minimum width:
          // Active item takes 3.5 flex (and min-width 360px), inactive take 0.8
          const flexValue = isHovered ? 3.5 : 0.8;
          const minWidthValue = isHovered ? '340px' : '88px';

          return (
            <Link
              key={blade.id}
              href={blade.href}
              onMouseEnter={() => setHoveredIndex(idx)}
              onFocus={() => setHoveredIndex(idx)}
              style={{
                position: 'relative',
                flex: flexValue,
                minWidth: minWidthValue,
                height: '100%',
                overflow: 'hidden',
                transition:
                  'flex 0.6s cubic-bezier(0.25, 1, 0.5, 1), min-width 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                borderRight:
                  idx !== CATEGORY_BLADES.length - 1 ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'block',
              }}
              aria-label={`Explore ${blade.verticalTitle} collection`}
            >
              {/* Background Image with Zoom & Lighting Effects */}
              <img
                src={blade.imageUrl}
                alt={`${blade.verticalTitle} — ${blade.subtitle}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1.0)',
                  filter: isHovered
                    ? 'brightness(0.98) contrast(1.05)'
                    : 'brightness(0.68) contrast(1.1) grayscale(20%)',
                  transition:
                    'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease',
                }}
              />

              {/* Gradient Vignette Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: isHovered
                    ? 'linear-gradient(180deg, rgba(17,17,17,0.1) 0%, rgba(17,17,17,0.3) 40%, rgba(17,17,17,0.88) 100%)'
                    : 'linear-gradient(180deg, rgba(17,17,17,0.3) 0%, rgba(17,17,17,0.55) 50%, rgba(17,17,17,0.85) 100%)',
                  transition: 'background 0.5s ease',
                }}
              />

              {/* Vertical Title (Rotated Bottom-to-Top along the blade) */}
              <div
                style={{
                  position: 'absolute',
                  top: '36px',
                  bottom: isHovered ? '160px' : '40px',
                  right: isHovered ? '28px' : '50%',
                  transform: isHovered ? 'none' : 'translateX(50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  zIndex: 3,
                  pointerEvents: 'none',
                  transition: 'right 0.5s cubic-bezier(0.25, 1, 0.5, 1), bottom 0.5s ease',
                }}
              >
                {/* Number */}
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    color: isHovered ? '#D4AF37' : 'rgba(255, 255, 255, 0.65)',
                    fontWeight: 600,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {blade.number}
                </span>

                {/* Vertical Rotated Typography */}
                <span
                  className="font-sans"
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    fontSize: isHovered ? 'clamp(32px, 3.2vw, 44px)' : 'clamp(26px, 2.4vw, 34px)',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap',
                    textShadow: '0 2px 14px rgba(0, 0, 0, 0.7)',
                    transition: 'font-size 0.5s ease',
                  }}
                >
                  {blade.verticalTitle}
                </span>
              </div>

              {/* Hover Reveal Card at Bottom of Expanded Blade (Cleanly secluded to left side) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: '90px',
                  padding: '36px 32px',
                  zIndex: 4,
                  opacity: isHovered ? 1 : 0,
                  visibility: isHovered ? 'visible' : 'hidden',
                  transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                  transition:
                    'opacity 0.4s ease 0.1s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, visibility 0.4s ease',
                  pointerEvents: isHovered ? 'auto' : 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      color: '#D4AF37',
                      fontWeight: 600,
                    }}
                  >
                    {blade.itemCount}
                  </span>
                  <span
                    style={{
                      height: '1px',
                      width: '20px',
                      backgroundColor: '#D4AF37',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#FAF9F5',
                      fontWeight: 500,
                    }}
                  >
                    Limited Édition
                  </span>
                </div>

                <h3
                  className="font-serif"
                  style={{
                    fontSize: '22px',
                    fontWeight: 500,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                    margin: '0 0 6px 0',
                    lineHeight: 1.2,
                  }}
                >
                  {blade.subtitle}
                </h3>

                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(250, 249, 245, 0.85)',
                    lineHeight: 1.55,
                    maxWidth: '360px',
                    margin: '0 0 16px 0',
                  }}
                >
                  {blade.tagline}
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#FAF9F5',
                    fontWeight: 600,
                    borderBottom: '1px solid #D4AF37',
                    paddingBottom: '4px',
                  }}
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={13} color="#D4AF37" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MOBILE & TABLET RESPONSIVE SLIDER (<1024px)                               */}
      {/* Horizontal snap carousel preserving the tall editorial blade aesthetic    */}
      {/* ========================================================================= */}
      <div
        className="flex md:hidden"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          padding: '0 20px 48px 20px',
          gap: '16px',
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORY_BLADES.map((blade, idx) => (
          <Link
            key={`mobile-${blade.id}`}
            href={blade.href}
            data-aos="fade-up"
            data-aos-delay={idx * 60}
            style={{
              position: 'relative',
              flex: '0 0 78vw',
              maxWidth: '320px',
              height: '520px',
              overflow: 'hidden',
              scrollSnapAlign: 'start',
              backgroundColor: '#111111',
              display: 'block',
              textDecoration: 'none',
            }}
          >
            <img
              src={blade.imageUrl}
              alt={blade.verticalTitle}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(17,17,17,0.2) 0%, rgba(17,17,17,0.4) 40%, rgba(17,17,17,0.88) 100%)',
              }}
            />

            {/* Vertical Title Along Right */}
            <div
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                bottom: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 2,
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  color: '#D4AF37',
                  fontWeight: 600,
                }}
              >
                {blade.number}
              </span>
              <span
                className="font-sans"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontSize: '32px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                }}
              >
                {blade.verticalTitle}
              </span>
            </div>

            {/* Mobile Bottom Info */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: '60px',
                padding: '24px 20px',
                zIndex: 3,
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
                {blade.itemCount}
              </span>
              <h3
                className="font-serif"
                style={{
                  fontSize: '18px',
                  fontWeight: 500,
                  color: '#FFFFFF',
                  margin: '0 0 6px 0',
                }}
              >
                {blade.subtitle}
              </h3>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#FAF9F5',
                  fontWeight: 600,
                  borderBottom: '1px solid #D4AF37',
                  paddingBottom: '2px',
                }}
              >
                <span>Explore</span>
                <ArrowRight size={11} color="#D4AF37" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
