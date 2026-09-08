'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../lib/motion/gsap';

interface ManifestoSlide {
  image: string;
  alt: string;
  caption: string;
}

const MANIFESTO_SLIDES: ManifestoSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    alt: 'Artisanal Silk Pit Loom',
    caption: 'Chanderi Pit Looms • Madhya Pradesh',
  },
  {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    alt: 'Raw Tussar Silk Weaving',
    caption: 'Generational Weaving • Varanasi Heritage',
  },
  {
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop',
    alt: 'Architectural Tailoring and Draping',
    caption: 'Sartorial Tailoring • 11 to 11 Heritage',
  },
  {
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop',
    alt: 'The Sovereign Silk Trench',
    caption: 'Mulberry Silk Organza • Hand-Finished',
  },
];

export const BrandStory: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slider
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % MANIFESTO_SLIDES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % MANIFESTO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + MANIFESTO_SLIDES.length) % MANIFESTO_SLIDES.length);
  };

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: 'inset(10% 0% 10% 0%)', opacity: 0.9 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '112px 24px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '64px',
          alignItems: 'center',
        }}
      >
        {/* Left: Interactive Editorial Image Slider with 10px Border Radius */}
        <div
          ref={imageRef}
          data-aos="fade-up"
          data-aos-delay="100"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            position: 'relative',
            aspectRatio: '4/5',
            overflow: 'hidden',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-secondary)',
            isolation: 'isolate',
            transform: 'translateZ(0)',
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
            maskImage: '-webkit-radial-gradient(white, black)',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
          }}
          aria-roledescription="carousel"
          aria-label="The 11 to 11 Manifesto Visual Gallery"
        >
          {/* Slides Stack */}
          {MANIFESTO_SLIDES.map((slide, idx) => (
            <div
              key={slide.image}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: idx === currentSlide ? 1 : 0,
                transform: idx === currentSlide ? 'scale(1.0)' : 'scale(1.05)',
                transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: idx === currentSlide ? 'auto' : 'none',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  display: 'block',
                }}
              />
            </div>
          ))}

          {/* Vignette Gradients */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)',
              pointerEvents: 'none',
              borderRadius: '10px',
            }}
          />

          {/* Top Progress Line Indicators */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '20px',
              right: '20px',
              display: 'flex',
              gap: '6px',
              zIndex: 4,
            }}
          >
            {MANIFESTO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  height: '3px',
                  flex: 1,
                  backgroundColor: idx === currentSlide ? '#D4AF37' : 'rgba(255, 255, 255, 0.35)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'background-color 0.4s ease',
                }}
              />
            ))}
          </div>

          {/* Dynamic Location Badge (Bottom Left) */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              backgroundColor: 'rgba(17, 17, 17, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#FAF9F5',
              padding: '10px 16px',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.4s ease',
              zIndex: 3,
            }}
          >
            {MANIFESTO_SLIDES[currentSlide].caption}
          </div>

          {/* Controls & Counter (Bottom Right) */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              right: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 3,
            }}
          >
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: 'rgba(255, 255, 255, 0.95)',
                marginRight: '6px',
                fontFamily: 'var(--font-serif)',
                fontWeight: 500,
              }}
            >
              0{currentSlide + 1} / 0{MANIFESTO_SLIDES.length}
            </span>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(17, 17, 17, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#FAF9F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D4AF37')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(17, 17, 17, 0.75)')}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(17, 17, 17, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#FAF9F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D4AF37')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(17, 17, 17, 0.75)')}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right: Heritage & Craft Storytelling */}
        <div>
          <span
            data-aos="fade-up"
            data-aos-delay="50"
            style={{
              fontSize: '10px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold-dark)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '12px',
            }}
          >
            The 11 to 11 Manifesto
          </span>

          <h2
            data-aos="fade-up"
            data-aos-delay="120"
            className="font-serif"
            style={{
              fontSize: 'clamp(30px, 4.2vw, 44px)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              marginBottom: '24px',
            }}
          >
            Where Ancient Indian Heritage Meets Architectural Precision
          </h2>

          <p
            data-aos="fade-up"
            data-aos-delay="180"
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              marginBottom: '20px',
            }}
          >
            Each 11 to 11 garment originates from indigenous handloom clusters across Madhya Pradesh, Varanasi, and Bengal. We marry unbleached wild tussar silks and hand-drawn real silver zari selvedges with razor-sharp Western outerwear tailoring.
          </p>

          <p
            data-aos="fade-up"
            data-aos-delay="220"
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              marginBottom: '36px',
            }}
          >
            No shortcuts, no synthetic blends, and zero mass production. We create contemporary heirlooms designed to be worn, cherished, and collected.
          </p>

          <Link
            href="/collections"
            data-aos="fade-up"
            data-aos-delay="260"
            className="btn-luxury-dark"
          >
            <span>Read The 11 to 11 Chronicle</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};
