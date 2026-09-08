'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../lib/motion/gsap';

export const CampaignSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (bgRef.current && sectionRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 12,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '58vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        color: '#FFFFFF',
      }}
    >
      {/* Background Image Layer with Scroll Parallax */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: '-10% 0',
          backgroundImage:
            'url("https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1800&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          zIndex: 0,
        }}
      />

      {/* Atmospheric Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(17,17,17,0.45) 0%, rgba(17,17,17,0.7) 100%)',
          zIndex: 1,
        }}
      />

      {/* Campaign Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '800px',
          padding: '80px 24px',
        }}
      >
        <span
          data-aos="fade-up"
          data-aos-delay="40"
          style={{
            fontSize: '11px',
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: '#D4AF37',
            display: 'block',
            marginBottom: '16px',
            fontWeight: 600,
          }}
        >
          Collection 01
        </span>

        <h2
          data-aos="fade-up"
          data-aos-delay="120"
          className="font-serif"
          style={{
            fontSize: 'clamp(38px, 6vw, 72px)',
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            marginBottom: '32px',
          }}
        >
          QUIETLY DISTINCTIVE.
        </h2>

        <Link
          href="/collections"
          data-aos="fade-up"
          data-aos-delay="180"
          className="btn-luxury-dark"
          style={{
            backgroundColor: '#FAF9F5',
            color: '#111111',
            borderColor: '#FAF9F5',
            padding: '16px 36px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>Explore The Runway Series</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};
