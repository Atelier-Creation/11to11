'use client';

import { gsap, prefersReducedMotion } from './gsap';

/**
 * Scroll-driven fade-in and subtle upward movement
 */
export function initScrollFadeUp(
  element: HTMLElement | null,
  options: {
    y?: number;
    duration?: number;
    delay?: number;
    startTrigger?: string;
  } = {}
) {
  if (!element || prefersReducedMotion()) return;

  const { y = 28, duration = 0.9, delay = 0, startTrigger = 'top 85%' } = options;

  return gsap.fromTo(
    element,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: startTrigger,
        once: true,
      },
    }
  );
}

/**
 * Staggered fade and rise for lists or cards
 */
export function initStaggerReveal(
  container: HTMLElement | null,
  targetSelector: string,
  stagger: number = 0.15
) {
  if (!container || prefersReducedMotion()) return;

  const items = container.querySelectorAll(targetSelector);
  if (!items.length) return;

  return gsap.fromTo(
    items,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        once: true,
      },
    }
  );
}
