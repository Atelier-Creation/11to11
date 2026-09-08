'use client';

import { gsap, prefersReducedMotion } from './gsap';

/**
 * Scrubbed ScrollTrigger Parallax
 */
export function initParallaxScrub(
  triggerElement: HTMLElement | null,
  targetElement: HTMLElement | null,
  options: {
    yPercent?: number;
    scrub?: number | boolean;
    start?: string;
    end?: string;
  } = {}
) {
  if (!triggerElement || !targetElement || prefersReducedMotion()) return;

  const { yPercent = 16, scrub = 0.5, start = 'top top', end = 'bottom top' } = options;

  return gsap.to(targetElement, {
    yPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: triggerElement,
      start,
      end,
      scrub,
    },
  });
}
