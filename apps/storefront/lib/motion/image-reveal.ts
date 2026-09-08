'use client';

import { gsap, prefersReducedMotion } from './gsap';

/**
 * Curtain / Mask Reveal Animation with scale settlement
 */
export function initImageCurtainReveal(
  container: HTMLElement | null,
  options: {
    scaleFrom?: number;
    duration?: number;
    startTrigger?: string;
  } = {}
) {
  if (!container || prefersReducedMotion()) return;

  const img = container.querySelector('img');
  const { scaleFrom = 1.1, duration = 1.3, startTrigger = 'top 80%' } = options;

  if (img) {
    gsap.fromTo(
      img,
      { scale: scaleFrom },
      {
        scale: 1,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: startTrigger,
          once: true,
        },
      }
    );
  }

  // Clip path curtain reveal on container if configured
  gsap.fromTo(
    container,
    { clipPath: 'inset(12% 0% 12% 0%)', opacity: 0.9 },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      duration: duration * 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: startTrigger,
        once: true,
      },
    }
  );
}
