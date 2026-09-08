'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { TransitionLink } from '../../../components/motion/TransitionLink';
import { CollectionRecord } from '../data/collections.data';

interface CollectionCardProps {
  collection: CollectionRecord;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const [isHovered, setIsHovered] = useState(false);

  const fullTitle = collection.titleLine2
    ? `${collection.titleLine1} ${collection.titleLine2}`
    : collection.titleLine1;

  return (
    <TransitionLink
      href={collection.href}
      transitionLabel={`ENTERING ${fullTitle}`.toUpperCase()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        aspectRatio: '4/5',
        overflow: 'hidden',
        backgroundColor: '#111111',
        display: 'block',
        textDecoration: 'none',
        boxShadow: isHovered
          ? '0 16px 36px -8px rgba(0, 0, 0, 0.22)'
          : '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        transition: 'box-shadow 0.4s ease, transform 0.4s ease',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
      aria-label={`Explore ${fullTitle}`}
    >
      {/* Background Image with Zoom */}
      <img
        src={collection.imageUrl}
        alt={`${collection.titleLine1} ${collection.titleLine2 || ''}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: isHovered ? 'scale(1.05)' : 'scale(1.0)',
          transition: 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'block',
        }}
      />

      {/* Dramatic Contrast Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.85) 85%, rgba(0,0,0,0.94) 100%)',
          transition: 'background 0.35s ease',
        }}
      />

      {/* Card Content (Anchored to Bottom) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2,
        }}
      >
        {/* Eyebrow: CAPSULE #X */}
        <span
          style={{
            fontSize: '9px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#E8E3DA',
            fontWeight: 600,
            display: 'block',
            marginBottom: '6px',
            opacity: 0.9,
          }}
        >
          {collection.capsuleNumber}
        </span>

        {/* Title */}
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(22px, 2.3vw, 28px)',
            fontWeight: 400,
            color: '#FAF9F5',
            lineHeight: 1.18,
            margin: '0 0 10px 0',
            letterSpacing: '-0.01em',
          }}
        >
          {collection.titleLine1}
          {collection.titleLine2 && (
            <>
              <br />
              {collection.titleLine2}
            </>
          )}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: '12px',
            color: 'rgba(250, 249, 245, 0.8)',
            lineHeight: 1.5,
            margin: '0 0 20px 0',
            maxWidth: '92%',
          }}
        >
          {collection.description}
        </p>

        {/* Bottom Row: Explore Collection + Circular Arrow Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.14)',
            paddingTop: '14px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#FAF9F5',
              fontWeight: 500,
              transition: 'color 0.2s ease',
            }}
          >
            Explore Collection
          </span>

          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isHovered ? '#111111' : '#FAF9F5',
              backgroundColor: isHovered ? '#FAF9F5' : 'transparent',
              transition: 'all 0.25s ease',
            }}
          >
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </TransitionLink>
  );
};
