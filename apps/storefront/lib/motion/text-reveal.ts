'use client';

import { gsap, prefersReducedMotion } from './gsap';

/**
 * Sequential line / typography reveal
 */
export function initTextSequenceReveal(
  container: HTMLElement | null,
  options: {
    kickerSelector?: string;
    titleSelector?: string;
    descSelector?: string;
    ctaSelector?: string;
  } = {}
) {
  if (!container || prefersReducedMotion()) return;

  const {
    kickerSelector = '.reveal-kicker',
    titleSelector = '.reveal-title',
    descSelector = '.reveal-desc',
    ctaSelector = '.reveal-cta',
  } = options;

  const kicker = container.querySelector(kickerSelector);
  const title = container.querySelector(titleSelector);
  const desc = container.querySelector(descSelector);
  const cta = container.querySelector(ctaSelector);

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (kicker) {
    tl.fromTo(kicker, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.1 });
  }
  if (title) {
    tl.fromTo(title, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.95 }, kicker ? '-=0.5' : 0);
  }
  if (desc) {
    tl.fromTo(desc, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
  }
  if (cta) {
    tl.fromTo(cta, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
  }

  return tl;
}
