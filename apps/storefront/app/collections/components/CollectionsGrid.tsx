'use client';

import React, { useEffect, useRef } from 'react';
import { CollectionRecord } from '../data/collections.data';
import { CollectionCard } from './CollectionCard';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../../lib/motion/gsap';

interface CollectionsGridProps {
  collections: CollectionRecord[];
  activeCategory: string;
}

export const CollectionsGrid: React.FC<CollectionsGridProps> = ({ collections, activeCategory }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  // GSAP Initial Viewport Scroll Entrance
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion() || !gridRef.current) return;

    const cards = gridRef.current.children;
    if (!cards || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  // GSAP Filter Transition on category change
  useEffect(() => {
    // Skip on very first mount so initial ScrollTrigger handles it
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (typeof window === 'undefined' || prefersReducedMotion() || !gridRef.current) return;

    const cards = gridRef.current.children;
    if (!cards || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.05,
          ease: 'power3.out',
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [activeCategory, collections]);

  if (collections.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: 'var(--text-secondary)',
          border: '1px dashed var(--border-light)',
          marginBottom: '64px',
        }}
      >
        <div style={{ fontSize: '14px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          No capsules found in this category
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="collections-responsive-grid"
      style={{
        display: 'grid',
        gap: '24px',
        marginBottom: '64px',
      }}
    >
      {collections.map((col) => (
        <div key={col.id} className="collection-card-wrapper">
          <CollectionCard collection={col} />
        </div>
      ))}

      <style jsx>{`
        .collections-responsive-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 1024px) {
          .collections-responsive-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .collections-responsive-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
