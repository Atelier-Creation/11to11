'use client';

import React, { useRef, useCallback } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { useLuxuryTransition } from './LuxuryRouteTransition';

interface TransitionLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  transitionLabel?: string;
  children: React.ReactNode;
}

// Session-level prefetch cache to prevent redundant router.prefetch calls
const prefetchedUrls = new Set<string>();

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  href,
  transitionLabel,
  onClick,
  onMouseEnter,
  onFocus,
  children,
  target,
  ...rest
}) => {
  const router = useRouter();
  const { triggerTransition } = useLuxuryTransition();
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const hrefString = typeof href === 'string' ? href : href.pathname || '';

  // Intent-based prefetch: 60ms dwell check prevents spamming prefetch during fast cursor movement
  const handleIntent = useCallback(() => {
    if (!hrefString || prefetchedUrls.has(hrefString) || hrefString.startsWith('http')) return;

    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

    hoverTimerRef.current = setTimeout(() => {
      prefetchedUrls.add(hrefString);
      router.prefetch(hrefString);
    }, 60);
  }, [hrefString, router]);

  const handleIntentCancel = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // 1. Preserve browser defaults for modifier clicks (Ctrl/Cmd, Shift, Alt), right clicks, or new tabs
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      target === '_blank' ||
      hrefString.startsWith('http') ||
      hrefString.startsWith('#')
    ) {
      onClick?.(e);
      return;
    }

    // 2. Synchronously trigger the luxury transition overlay (0ms)
    triggerTransition(transitionLabel);

    // 3. Allow Next.js Link default navigation to execute concurrently (non-blocking)
    onClick?.(e);
  };

  return (
    <Link
      href={href}
      target={target}
      onMouseEnter={(e) => {
        handleIntent();
        onMouseEnter?.(e);
      }}
      onMouseLeave={handleIntentCancel}
      onFocus={(e) => {
        handleIntent();
        onFocus?.(e);
      }}
      onBlur={handleIntentCancel}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  );
};
