'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/motion/gsap';

interface PillarItem {
  number: string;
  title: string;
  subhead: string;
  provenance: string;
  description: string;
  imageUrl: string;
}

const PILLARS: PillarItem[] = [
  {
    number: '01',
    title: 'CRAFT',
    subhead: 'Indigenous Handloom Heritage',
    provenance: 'Pit Looms of Chanderi & Varanasi',
    description:
      'Woven on generational wooden pit looms using hand-spun yarns. Finished with authentic hand-drawn silver zari selvedges that honor centuries of Indian textile poetry.',
    imageUrl:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop',
  },
  {
    number: '02',
    title: 'FABRIC',
    subhead: 'Uncompromised Fiber Purity',
    provenance: 'Wild Tussar, Mulberry Silk & Cashmere',
    description:
      'Certified 100% natural fibers with zero synthetic blending. Double-faced Mongolian cashmere, unbleached textured wild tussar, and crisp mulberry silk organza.',
    imageUrl:
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1600&auto=format&fit=crop',
  },
  {
    number: '03',
    title: 'FIT',
    subhead: 'Architectural Western Drapery',
    provenance: 'Razor-Cut Western Tailoring',
    description:
      'Sculpted shoulders, clean unlined internal French-bound seams, and calculated drapery that moves with statuesque stillness and effortless modern authority.',
    imageUrl:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
  },
  {
    number: '04',
    title: 'DETAIL',
    subhead: 'Heirloom Sartorial Finishes',
    provenance: 'Natural Horn Closures & Micro-Binding',
    description:
      'Natural carved horn closures, French-bound seam work, and reinforced hand-finished selvedges engineered to be worn, collected, and treasured across generations.',
    imageUrl:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
  },
];

export const PinnedFeatures: React.FC = () => {
  const [activePillar, setActivePillar] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const containerRef = useRef<HTMLElement>(null);
  const isClickingRef = useRef(false);

  // 1. Detect screen size (desktop vs mobile/tablet)
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Scroll-driven pillar slide changing
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Both ScrollTrigger and window scroll fallback for bulletproof slide changing
    const handleScroll = () => {
      if (!containerRef.current || isClickingRef.current || window.innerWidth < 1024) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setScrollProgress(progress);

      // Divide scroll progress into 4 clean intervals:
      // 0.00 - 0.25 -> 0 (CRAFT)
      // 0.25 - 0.50 -> 1 (FABRIC)
      // 0.50 - 0.75 -> 2 (FIT)
      // 0.75 - 1.00 -> 3 (DETAIL)
      const step = Math.min(
        PILLARS.length - 1,
        Math.max(0, Math.floor(progress * PILLARS.length))
      );
      setActivePillar(step);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // GSAP ScrollTrigger integration
    let ctx: gsap.Context | null = null;
    if (!prefersReducedMotion() && window.innerWidth >= 1024) {
      ctx = gsap.context(() => {
        if (containerRef.current) {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.1,
            onUpdate: (self) => {
              if (isClickingRef.current) return;
              setScrollProgress(self.progress);
              const step = Math.min(
                PILLARS.length - 1,
                Math.max(0, Math.floor(self.progress * PILLARS.length))
              );
              setActivePillar(step);
            },
          });
        }
      }, containerRef);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (ctx) ctx.revert();
    };
  }, []);

  const handlePillarClick = (idx: number) => {
    setActivePillar(idx);
    isClickingRef.current = true;

    // Smoothly scroll the container to the targeted pillar segment on desktop
    if (containerRef.current && window.innerWidth >= 1024) {
      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const scrollableDist = containerRef.current.offsetHeight - window.innerHeight;
      const targetScroll = containerTop + ((idx + 0.3) / PILLARS.length) * scrollableDist;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }

    setTimeout(() => {
      isClickingRef.current = false;
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (idx + 1) % PILLARS.length;
      handlePillarClick(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (idx - 1 + PILLARS.length) % PILLARS.length;
      handlePillarClick(prev);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePillarClick(idx);
    }
  };

  const current = PILLARS[activePillar];

  return (
    <section
      ref={containerRef}
      id="pillars-section"
      style={{
        position: 'relative',
        backgroundColor: '#FAF9F5',
        borderTop: '1px solid var(--border-light)',
        height: isDesktop ? '320vh' : 'auto',
      }}
    >
      {/* ========================================================================= */}
      {/* DESKTOP SPLIT-SCREEN (>=1024px)                                          */}
      {/* Content strictly on LEFT (46%) | Image strictly on RIGHT (54%)           */}
      {/* ========================================================================= */}
      {isDesktop ? (
        <div
          style={{
            position: 'sticky',
            top: '64px',
            height: 'calc(100vh - 64px)',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '46% 54%',
            overflow: 'hidden',
          }}
        >
          {/* LEFT COLUMN: Narrative, Active Pillar, and Interactive Tabs */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '48px 56px',
              backgroundColor: '#FAF9F5',
              borderRight: '1px solid var(--border-light)',
              height: '100%',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Top: Section Eyebrow and Headline */}
            <div>
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
                Signature Principles
              </span>
              <h2
                data-aos="fade-up"
                data-aos-delay="100"
                className="font-serif"
                style={{
                  fontSize: 'clamp(30px, 3.2vw, 42px)',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                Four Pillars of 11 to 11
              </h2>
            </div>

            {/* Middle: Active Pillar Title, Subhead, and Story */}
            <div style={{ margin: '24px 0' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '14px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    letterSpacing: '0.2em',
                    color: 'var(--accent-gold-dark)',
                    fontWeight: 600,
                  }}
                >
                  {current.number} / 04
                </span>
                <span
                  style={{
                    height: '1px',
                    width: '28px',
                    backgroundColor: 'var(--accent-gold)',
                  }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}
                >
                  {current.provenance}
                </span>
              </div>

              <h3
                key={`title-${activePillar}`}
                className="font-serif"
                style={{
                  fontSize: 'clamp(42px, 4.2vw, 58px)',
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                  margin: '0 0 10px 0',
                  animation: 'pillarTextFade 0.4s ease-out',
                }}
              >
                {current.title}
              </h3>

              <div
                key={`subhead-${activePillar}`}
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold-dark)',
                  fontWeight: 600,
                  marginBottom: '18px',
                  animation: 'pillarTextFade 0.4s ease-out 0.05s both',
                }}
              >
                {current.subhead}
              </div>

              <p
                key={`desc-${activePillar}`}
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                  maxWidth: '440px',
                  margin: 0,
                  animation: 'pillarTextFade 0.4s ease-out 0.1s both',
                }}
              >
                {current.description}
              </p>
            </div>

            {/* Bottom: Tabs and Progress Line */}
            <div>
              <div
                role="tablist"
                aria-label="Pillars of 11 to 11 Navigation"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                {PILLARS.map((pillar, idx) => {
                  const isActive = idx === activePillar;
                  return (
                    <button
                      key={pillar.number}
                      role="tab"
                      id={`pillar-tab-${idx}`}
                      aria-selected={isActive}
                      aria-controls={`pillar-panel-${idx}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => handlePillarClick(idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '8px 0',
                        cursor: 'pointer',
                        textAlign: 'left',
                        outline: 'none',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '10px',
                          fontWeight: 600,
                          color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                          display: 'block',
                          letterSpacing: '0.15em',
                          transition: 'color 0.25s ease',
                        }}
                      >
                        {pillar.number}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                          display: 'block',
                          marginTop: '2px',
                          transition: 'color 0.25s ease',
                        }}
                      >
                        {pillar.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Progress Line */}
              <div
                style={{
                  height: '2px',
                  width: '100%',
                  backgroundColor: 'var(--border-light)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${Math.min(100, Math.max(14, (scrollProgress || (activePillar + 0.5) / 4) * 100))}%`,
                    height: '100%',
                    backgroundColor: 'var(--text-primary)',
                    transition: 'width 0.15s ease-out',
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Full-Height Edge-to-Edge Image Stage */}
          <div
            style={{
              position: 'relative',
              height: '100%',
              width: '100%',
              overflow: 'hidden',
              backgroundColor: '#111111',
            }}
          >
            {PILLARS.map((pillar, idx) => {
              const isActive = idx === activePillar;
              return (
                <div
                  key={pillar.number}
                  role="tabpanel"
                  id={`pillar-panel-${idx}`}
                  aria-labelledby={`pillar-tab-${idx}`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: isActive ? 1 : 0,
                    visibility: isActive ? 'visible' : 'hidden',
                    transition:
                      'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.65s ease',
                    zIndex: isActive ? 2 : 1,
                  }}
                >
                  <img
                    src={pillar.imageUrl}
                    alt={`${pillar.title} — ${pillar.subhead}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: isActive ? 'scale(1.0)' : 'scale(1.04)',
                      transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />

                  {/* Vignette Shadow */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(17,17,17,0.06) 0%, rgba(17,17,17,0.45) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Monogram Watermark in bottom right */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '36px',
                      right: '40px',
                      textAlign: 'right',
                      color: '#FFFFFF',
                      zIndex: 3,
                      pointerEvents: 'none',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '9px',
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase',
                        color: '#D4AF37',
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      {pillar.provenance}
                    </span>
                    <span
                      className="font-serif"
                      style={{
                        fontSize: '18px',
                        letterSpacing: '0.18em',
                        fontWeight: 500,
                      }}
                    >
                      11 TO 11
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MOBILE & TABLET COMPOSITION (<1024px)                                     */
        /* Clean touch-friendly stacked editorial layout                             */
        /* ========================================================================= */
        <div style={{ padding: '56px 20px' }}>
          {/* Eyebrow & Title */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
              Signature Principles
            </span>
            <h2
              data-aos="fade-up"
              data-aos-delay="100"
              className="font-serif"
              style={{
                fontSize: 'clamp(26px, 6vw, 34px)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Four Pillars of 11 to 11
            </h2>
          </div>

          {/* Tap Rail */}
          <div
            role="tablist"
            aria-label="Pillars of 11 to 11 Mobile"
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '14px',
              marginBottom: '20px',
              scrollbarWidth: 'none',
            }}
          >
            {PILLARS.map((pillar, idx) => {
              const isActive = idx === activePillar;
              return (
                <button
                  key={pillar.number}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActivePillar(idx)}
                  style={{
                    minHeight: '44px',
                    padding: '8px 16px',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--text-primary)' : 'var(--border-light)',
                    backgroundColor: isActive ? 'var(--text-primary)' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : 'var(--text-primary)',
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  {pillar.number} {pillar.title}
                </button>
              );
            })}
          </div>

          {/* 3:4 Responsive Image Stage */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '3/4',
              width: '100%',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-secondary)',
              marginBottom: '20px',
            }}
          >
            {PILLARS.map((pillar, idx) => (
              <img
                key={pillar.number}
                src={pillar.imageUrl}
                alt={pillar.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: idx === activePillar ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }}
              />
            ))}

            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: '#111111',
                color: '#FAF9F5',
                padding: '6px 12px',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              {current.number} • {current.title}
            </div>
          </div>

          {/* Mobile Narrative */}
          <div style={{ padding: '0 4px' }}>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--accent-gold-dark)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                marginBottom: '6px',
              }}
            >
              {current.subhead}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginBottom: '10px',
              }}
            >
              {current.provenance}
            </div>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {current.description}
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pillarTextFade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};
