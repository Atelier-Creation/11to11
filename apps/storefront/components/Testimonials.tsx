'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export interface PatronCitation {
  id: string;
  quote: string;
  author: string;
  context: string;
  city?: string;
}

// Curated demo citations structured for direct replacement by backend patron reviews
const CITATIONS: PatronCitation[] = [
  {
    id: 'citation-1',
    quote:
      'The Sovereign Silk Trench has an arresting presence. The weight of the mulberry silk organza and the architectural storm flap drape feel comparable to Parisian haute couture, yet deeply grounded in Indian textile heritage.',
    author: 'Patron Citation',
    context: '11 to 11 Sovereign Silk Trench',
    city: 'New Delhi',
  },
  {
    id: 'citation-2',
    quote:
      'The double-faced cashmere overcoat is utterly weightless yet intensely warm. From the hand-finished unlined seams to the white-glove arrival, 11to11 sets the modern standard for Indian luxury.',
    author: 'Patron Citation',
    context: 'Bespoke Cashmere Overcoat',
    city: 'Mumbai',
  },
  {
    id: 'citation-3',
    quote:
      'I wore the Crepe de Chine Column Gown to an evening salon. The asymmetric shoulder drape fell with sculptural stillness. Discretion, tactile luxury, and effortless elegance.',
    author: 'Patron Citation',
    context: 'Column Gown & Drapes',
    city: 'Bengaluru',
  },
  {
    id: 'citation-4',
    quote:
      'The unbleached wild tussar drape possesses an extraordinary organic luster. You can feel the generational knowledge of the Chanderi and Varanasi master weavers in every selvedge.',
    author: 'Patron Citation',
    context: 'Handcrafted Silk Capsule',
    city: 'Kolkata',
  },
  {
    id: 'citation-5',
    quote:
      'Exceptional architectural tailoring. The razor-cut structured shoulders paired with fluid French-bound internal finishes make this my most treasured piece in contemporary luxury.',
    author: 'Patron Citation',
    context: 'Sartorial Power Blazer',
    city: 'London / Mumbai',
  },
];

const AUTO_SLIDE_INTERVAL = 5500; // 5.5 seconds per slide

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slider effect with hover-pause and manual reset
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CITATIONS.length);
      setProgressKey((k) => k + 1);
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex]);

  const resetTimer = () => {
    setProgressKey((k) => k + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? CITATIONS.length - 1 : prev - 1));
    resetTimer();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CITATIONS.length);
    resetTimer();
  };

  const handleSelect = (idx: number) => {
    setCurrentIndex(idx);
    resetTimer();
  };

  const active = CITATIONS[currentIndex];
  const pageIndicator = `0${currentIndex + 1} / 0${CITATIONS.length}`;

  return (
    <section
      style={{
        backgroundColor: '#111111',
        color: '#FAF9F5',
        padding: '130px 24px 120px 24px',
        overflow: 'hidden',
        position: 'relative',
        borderTop: '1px solid #1E1E1E',
        borderBottom: '1px solid #1E1E1E',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Patron Chronicles Testimonials"
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Subtle Architectural Background Monogram */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.035,
            fontSize: 'clamp(110px, 18vw, 180px)',
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.24em',
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          11 11
        </div>

        {/* Eyebrow with Live Auto-Play Status Indicator */}
        <div
          data-aos="fade-up"
          data-aos-delay="40"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              color: '#D4AF37',
              fontWeight: 600,
              display: 'block',
            }}
          >
            Patron Chronicles
          </span>

          <span
            style={{
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: isPaused ? '#6E6862' : '#9E968D',
              borderLeft: '1px solid #2A2A2A',
              paddingLeft: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isPaused ? <Pause size={10} color="#6E6862" /> : <Play size={10} color="#D4AF37" />}
            {isPaused ? 'Paused' : 'Auto'}
          </span>
        </div>

        {/* Editorial Quote Stage with Smooth Animated Transition */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          style={{
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
          }}
          aria-live="polite"
        >
          <p
            key={`quote-${currentIndex}`}
            className="font-serif"
            style={{
              fontSize: 'clamp(20px, 3vw, 30px)',
              fontWeight: 400,
              lineHeight: 1.52,
              color: '#FAF9F5',
              maxWidth: '860px',
              margin: '0 auto 30px auto',
              fontStyle: 'italic',
              animation: 'patronFadeIn 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            &ldquo;{active.quote}&rdquo;
          </p>

          <div
            key={`author-${currentIndex}`}
            style={{
              animation: 'patronFadeIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#FAF9F5',
              }}
            >
              — {active.author} {active.city ? `• ${active.city}` : ''}
            </div>
            <div style={{ fontSize: '11px', color: '#9E968D', marginTop: '6px', letterSpacing: '0.08em' }}>
              <span style={{ color: '#D4AF37' }}>{active.context}</span>
            </div>
          </div>
        </div>

        {/* Architectural Gold Progress Bar for Active Slide */}
        <div
          data-aos="fade-up"
          data-aos-delay="160"
          style={{
            maxWidth: '240px',
            height: '2px',
            backgroundColor: '#222222',
            margin: '44px auto 0 auto',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            key={`progress-${progressKey}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              backgroundColor: '#D4AF37',
              animation: isPaused
                ? 'none'
                : `slideProgress ${AUTO_SLIDE_INTERVAL}ms linear forwards`,
              width: isPaused ? '100%' : '0%',
            }}
          />
        </div>

        {/* Numbered Indicator, Pagination Pills & Navigation Controls */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px',
            marginTop: '32px',
          }}
        >
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            style={{
              width: '42px',
              height: '42px',
              border: '1px solid #2A2A2A',
              backgroundColor: 'transparent',
              color: '#FAF9F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.25s ease, background-color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#D4AF37';
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2A2A2A';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Previous patron citation"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Interactive Pagination Dots / Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {CITATIONS.map((_, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  style={{
                    width: isSelected ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '0px',
                    backgroundColor: isSelected ? '#D4AF37' : '#2A2A2A',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    padding: 0,
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>

          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              letterSpacing: '0.22em',
              color: 'var(--accent-gold)',
            }}
          >
            {pageIndicator}
          </span>

          {/* Next Button */}
          <button
            onClick={handleNext}
            style={{
              width: '42px',
              height: '42px',
              border: '1px solid #2A2A2A',
              backgroundColor: 'transparent',
              color: '#FAF9F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.25s ease, background-color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#D4AF37';
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2A2A2A';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Next patron citation"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes patronFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};
