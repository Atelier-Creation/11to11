'use client';

export * from './motion/gsap';
export * from './motion/scroll-reveal';
export * from './motion/image-reveal';
export * from './motion/text-reveal';
export * from './motion/parallax';

// Backwards compatibility functions
import { initTextSequenceReveal } from './motion/text-reveal';
import { initParallaxScrub } from './motion/parallax';
import { initScrollFadeUp } from './motion/scroll-reveal';
import { initImageCurtainReveal } from './motion/image-reveal';

export function initHeroReveal(container: HTMLElement | null) {
  return initTextSequenceReveal(container, {
    kickerSelector: '.hero-kicker',
    titleSelector: '.hero-title',
    descSelector: '.hero-desc',
    ctaSelector: '.hero-ctas',
  });
}

export function initHeroParallax(heroElement: HTMLElement | null, bgElement: HTMLElement | null) {
  return initParallaxScrub(heroElement, bgElement, { yPercent: 18, scrub: 0.5 });
}

export function initScrollReveal(element: HTMLElement | null, delay: number = 0) {
  return initScrollFadeUp(element, { delay });
}

export function initImageReveal(container: HTMLElement | null) {
  return initImageCurtainReveal(container);
}
