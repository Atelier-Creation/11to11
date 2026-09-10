'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../lib/motion/gsap';

// ---------------------------------------------------------------------------
// Hero Slider Data
// ---------------------------------------------------------------------------
const slides = [
  {
    type: 'video',
    src: '/hero/intro-video.mp4',
    poster: '/hero/intro-poster.png',
    eyebrow: '11 TO 11 FOR WOMEN',
    headline: 'ARCHITECTURAL DRAPERY',
    description: 'Handcrafted limited editions using indigenous wild tussar, mulberry silk organza, and sculpted double‑faced Mongolian cashmere.',
    ctaText: 'Explore Collection',
    ctaHref: '/collections',
    skipLabel: 'SKIP INTRO',
  },
  {
    type: 'image',
    src: '/hero/slide-1.jpg',
    eyebrow: 'AUTUMN / WINTER 2026',
    headline: 'ARCHITECTURAL DRAPERY',
    description: 'Handcrafted limited editions using indigenous wild tussar, mulberry silk organza, and sculpted double‑faced Mongolian cashmere.',
    ctaText: 'Explore Collection',
    ctaHref: '/collections',
  },
  {
    type: 'image',
    src: '/hero/slide-2.jpg',
    eyebrow: 'THE 11 TO 11 EDIT',
    headline: 'PURE SILK REDEFINED',
    description: 'Hand-pleated fluidity meets sharp geometric tailoring in our signature heritage silks.',
    ctaText: 'Discover Silk',
    ctaHref: '/category/handcrafted-silk',
  },
  {
    type: 'image',
    src: '/hero/slide-3.jpg',
    eyebrow: '11 TO 11 SARTORIAL',
    headline: 'THE NEW INDIAN SILHOUETTE',
    description: 'Contemporary power blazers and eveningwear sculpted for the modern global tastemaker.',
    ctaText: 'View Eveningwear',
    ctaHref: '/category/eveningwear',
  },
];

const IMAGE_DURATION = 5500; // ms display time per image
const TRANSITION_DURATION = 1.2; // seconds for GSAP cross‑fade

export const CinematicHero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const containerRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const prevIndexRef = useRef(0);

  // -----------------------------------------------------------------------
  // Autoplay timer for image slides
  // -----------------------------------------------------------------------
  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) {
      gsap.killTweensOf(progressRef.current);
      gsap.fromTo(
        progressRef.current,
        { width: '0%' },
        { width: '100%', duration: IMAGE_DURATION / 1000, ease: 'none' }
      );
    }
    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, IMAGE_DURATION);
  }, []);

  const stopTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) gsap.killTweensOf(progressRef.current);
  };

  // -----------------------------------------------------------------------
  // Slide transition effect via GSAP autoAlpha & subtle scale
  // -----------------------------------------------------------------------
  useEffect(() => {
    const allSlides = containerRef.current?.querySelectorAll('.slide');
    if (!allSlides || allSlides.length === 0) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      allSlides.forEach((el, idx) => {
        if (idx === current) {
          gsap.set(el, { autoAlpha: 1, scale: 1 });
        } else {
          gsap.set(el, { autoAlpha: 0, scale: 1.04 });
        }
      });
      if (slides[current].type === 'image') {
        startTimer();
      }
      return;
    }

    const prev = prevIndexRef.current;
    prevIndexRef.current = current;

    if (prefersReducedMotion()) {
      allSlides.forEach((el, idx) => {
        gsap.set(el, { autoAlpha: idx === current ? 1 : 0, scale: 1 });
      });
      if (slides[current].type === 'image') startTimer();
      return;
    }

    const prevSlide = containerRef.current?.querySelector(`.slide[data-index="${prev}"]`) as HTMLElement;
    const currSlide = containerRef.current?.querySelector(`.slide[data-index="${current}"]`) as HTMLElement;

    if (prevSlide && prev !== current) {
      gsap.to(prevSlide, {
        autoAlpha: 0,
        scale: 1.025,
        duration: TRANSITION_DURATION,
        ease: 'power3.out',
      });
    }

    if (currSlide) {
      gsap.fromTo(
        currSlide,
        { autoAlpha: 0, scale: 1.04 },
        { autoAlpha: 1, scale: 1, duration: TRANSITION_DURATION, ease: 'power3.out' }
      );
    }

    // Restart autoplay timer for image slides only
    if (slides[current].type === 'image') {
      startTimer();
    } else {
      stopTimer();
    }
  }, [current, startTimer]);

  // -----------------------------------------------------------------------
  // Video handling – auto-advances to slide 1 on video end
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsVideoPlaying(false);
      return;
    }
    const videoEl = videoRef.current;
    if (videoEl) {
      const handleEnded = () => {
        setIsVideoPlaying(false);
        setCurrent(1); // move to first image slide
      };
      videoEl.addEventListener('ended', handleEnded);
      videoEl.play().catch(() => setIsVideoPlaying(false));
      return () => videoEl.removeEventListener('ended', handleEnded);
    }
  }, []);

  // -----------------------------------------------------------------------
  // Navigation handlers
  // -----------------------------------------------------------------------
  const goPrev = () => {
    stopTimer();
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    stopTimer();
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handleSkip = () => {
    if (videoRef.current) videoRef.current.pause();
    setIsVideoPlaying(false);
    stopTimer();
    setCurrent(1);
  };

  // -----------------------------------------------------------------------
  // Hover pause logic
  // -----------------------------------------------------------------------
  const handlePointerEnter = () => stopTimer();
  const handlePointerLeave = () => {
    if (slides[current].type === 'image') startTimer();
  };

  // -----------------------------------------------------------------------
  // Touch swipe handling
  // -----------------------------------------------------------------------
  const startX = useRef<number | null>(null);
  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goPrev() : goNext();
    }
    startX.current = null;
  };

  return (
    <section
      ref={containerRef}
      className="hero-slider"
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      aria-label="Editorial Hero Campaign"
    >
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`slide ${idx === current ? 'active' : ''}`}
          data-index={idx}
          aria-hidden={idx !== current}
        >
          {slide.type === 'video' ? (
            <video
              ref={videoRef}
              src={slide.src}
              poster={slide.poster}
              preload="metadata"
              muted
              playsInline
              autoPlay={isVideoPlaying && !prefersReducedMotion()}
              className="slide-media"
            />
          ) : (
            <Image
              src={slide.src}
              alt={slide.headline}
              fill
              priority={idx <= 1}
              sizes="100vw"
              className="slide-media"
            />
          )}

          {/* Dark luxury atmospheric vignette overlay */}
          <div className="slide-overlay" />

          {/* Text overlay */}
          <div className="slide-content">
            {slide.eyebrow && (
              <div
                className="hero-kicker"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.34em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold, #E8C547)',
                  marginBottom: '18px',
                  fontWeight: 600,
                }}
              >
                {slide.eyebrow}
              </div>
            )}
            <h1
              className="font-serif hero-title"
              style={{
                fontSize: 'clamp(38px, 6.4vw, 76px)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                marginBottom: '20px',
                color: '#FAF9F5',
              }}
            >
              {slide.headline}
            </h1>
            {slide.description && (
              <p
                className="hero-desc"
                style={{
                  fontSize: 'clamp(14px, 1.8vw, 16px)',
                  color: 'rgba(250, 249, 245, 0.82)',
                  lineHeight: 1.7,
                  maxWidth: '620px',
                  margin: '0 auto 36px auto',
                  fontWeight: 300,
                }}
              >
                {slide.description}
              </p>
            )}
            <div
              className="hero-ctas"
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href={slide.ctaHref}
                className="btn-luxury-dark"
                style={{
                  backgroundColor: '#FAF9F5',
                  color: '#111111',
                  borderColor: '#FAF9F5',
                }}
              >
                <span>{slide.ctaText}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Skip Intro button for video slide */}
      {slides[current].type === 'video' && (
        <button
          onClick={handleSkip}
          className="skip-intro"
          aria-label="Skip video intro"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <span>{slides[current].skipLabel}</span>
          <ArrowRight size={13} />
        </button>
      )}

      {/* Luxury Navigation Controls */}
      <div className="hero-nav" role="group" aria-label="Hero navigation">
        <div style={{display:"flex", gap:"12px",alignItems: 'center',}}><button className="prev" aria-label="Previous slide" onClick={goPrev}>
          <ArrowLeft size={16} />
        </button>
        <span className="progress">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
        <button className="next" aria-label="Next slide" onClick={goNext}>
          <ArrowRight size={16} />
        </button></div>
        <div className="hero-progress-track">
          <div className="hero-progress-fill" ref={progressRef} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="hero-scroll-indicator"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          color: 'rgba(255, 255, 255, 0.75)',
        }}
        aria-label="Scroll to discover"
      >
        <span style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase' }}>
          Discover
        </span>
        <ArrowDown size={14} />
      </div>
    </section>
  );
};
