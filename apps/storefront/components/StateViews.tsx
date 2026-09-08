'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, PackageOpen, ArrowRight } from 'lucide-react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div style={{ width: '100%' }}>
      {/* 3:4 Aspect Ratio Image Box (CLS = 0) */}
      <div
        className="skeleton"
        style={{
          width: '100%',
          aspectRatio: '3/4',
          marginBottom: '12px',
        }}
      />
      {/* Eyebrow */}
      <div className="skeleton" style={{ width: '40%', height: '10px', marginBottom: '8px' }} />
      {/* Title */}
      <div className="skeleton" style={{ width: '80%', height: '14px', marginBottom: '8px' }} />
      {/* Price */}
      <div className="skeleton" style={{ width: '30%', height: '12px' }} />
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '24px',
        width: '100%',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionHref,
  onAction,
  icon,
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '64px 24px',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
          marginBottom: '20px',
        }}
      >
        {icon || <PackageOpen size={24} />}
      </div>
      <h3
        className="font-serif"
        style={{
          fontSize: '20px',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          fontWeight: 500,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '24px',
        }}
      >
        {description}
      </p>
      {actionText && (
        actionHref ? (
          <Link href={actionHref} className="btn-luxury-dark">
            <span>{actionText}</span>
            <ArrowRight size={14} />
          </Link>
        ) : (
          <button onClick={onAction} className="btn-luxury-dark">
            <span>{actionText}</span>
            <ArrowRight size={14} />
          </button>
        )
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Service Temporarily Unavailable',
  message,
  onRetry,
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        maxWidth: '460px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          backgroundColor: '#FEE2E2',
          color: '#B91C1C',
          marginBottom: '16px',
        }}
      >
        <AlertCircle size={22} />
      </div>
      <h3
        style={{
          fontSize: '16px',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          fontWeight: 600,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: '20px',
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-luxury-outline">
          Try Again
        </button>
      )}
    </div>
  );
};
