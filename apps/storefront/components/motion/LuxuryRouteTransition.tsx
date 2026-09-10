'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, prefersReducedMotion } from '../../lib/motion/gsap';

interface TransitionContextType {
  triggerTransition: (label?: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  triggerTransition: () => {},
  isTransitioning: false,
});

export const useLuxuryTransition = () => useContext(TransitionContext);

export const LuxuryRouteTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState('ENTERING COLLECTION');

  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);

  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Trigger transition immediately on click (0ms lag)
  const triggerTransition = useCallback((label?: string) => {
    setTransitionLabel(label || 'ENTERING COLLECTION');
    startedAt.current = Date.now();
    setIsActive(true);

    // Immediate DOM GSAP animation
    requestAnimationFrame(() => {
      if (!overlayRef.current) return;

      const reduced = prefersReducedMotion();

      // Entrance timeline
      gsap.killTweensOf([overlayRef.current, lineRef.current, textRef.current]);

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: reduced ? 0 : 0.2,
        ease: 'power2.out',
      });

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: reduced ? 0 : 0.45,
            ease: 'power3.out',
          }
        );
      }

      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: reduced ? 0 : 0.3,
            ease: 'power2.out',
          }
        );
      }
    });
  }, []);

  // Exit animation when destination route settles
  useEffect(() => {
    if (isActive && prevPathname.current !== pathname) {
      prevPathname.current = pathname;

      const elapsed = Date.now() - startedAt.current;
      const remainingGuard = Math.max(0, 150 - elapsed); // 150ms anti-flicker guard

      const exitTimer = setTimeout(() => {
        if (!overlayRef.current) {
          setIsActive(false);
          return;
        }

        const reduced = prefersReducedMotion();

        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: reduced ? 0 : 0.35,
          ease: 'power2.inOut',
          onComplete: () => {
            setIsActive(false);
          },
        });
      }, remainingGuard);

      return () => clearTimeout(exitTimer);
    } else {
      prevPathname.current = pathname;
    }
  }, [pathname, isActive]);

  // Failsafe timeout so the overlay never traps the user under any network anomaly
  useEffect(() => {
    if (!isActive) return;

    const failsafe = setTimeout(() => {
      if (isActive && overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => setIsActive(false),
        });
      }
    }, 1800);

    return () => clearTimeout(failsafe);
  }, [isActive]);

  return (
    <TransitionContext.Provider value={{ triggerTransition, isTransitioning: isActive }}>
      {children}

      {/* Luxury Route Transition Overlay */}
      <div
        ref={overlayRef}
        aria-hidden={!isActive}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(13, 13, 13, 0.97)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: isActive ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          pointerEvents: isActive ? 'auto' : 'none',
        }}
      >
        <div
          ref={textRef}
          style={{
            textAlign: 'center',
            padding: '32px',
            maxWidth: '440px',
            width: '100%',
          }}
        >
          {/* Brand Wordmark */}
          <div
            className="font-serif"
            style={{
              fontSize: 'clamp(20px, 2.5vw, 24px)',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: '#FAF9F5',
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            11 TO 11
          </div>

          {/* Champagne Gold Hairline Divider */}
          <div
            ref={lineRef}
            style={{
              width: '120px',
              height: '1px',
              backgroundColor: '#D4AF37',
              margin: '20px auto',
              transformOrigin: 'center center',
            }}
          />

          {/* Dynamic Contextual Subtitle */}
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C6A972',
              fontWeight: 500,
            }}
          >
            {transitionLabel}
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
};
