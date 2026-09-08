'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FILTER_CATEGORIES, FilterCategory, SortMode } from '../data/collections.data';

interface CollectionToolbarProps {
  activeCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  sortBy: SortMode;
  onSortChange: (mode: SortMode) => void;
}

export const CollectionToolbar: React.FC<CollectionToolbarProps> = ({
  activeCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '36px',
        borderBottom: '1px solid var(--border-light)',
        paddingBottom: '14px',
      }}
    >
      {/* Horizontal Scrollable Category Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '2px',
          maxWidth: '100%',
        }}
      >
        {FILTER_CATEGORIES.map((tab) => {
          const isActive = activeCategory === tab;
          return (
            <button
              key={tab}
              onClick={() => onSelectCategory(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '6px 0 10px 0',
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#111111' : '#888888',
                cursor: 'pointer',
                position: 'relative',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#111111';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#888888';
              }}
            >
              {tab}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-15px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: '#111111',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Sort By Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            fontWeight: 600,
          }}
        >
          SORT BY
        </span>
        <div style={{ position: 'relative' }}>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortMode)}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-light)',
              padding: '7px 28px 7px 12px',
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="featured">Featured</option>
            <option value="capsule_asc">Capsule # (Ascending)</option>
            <option value="capsule_desc">Capsule # (Descending)</option>
          </select>
          <ChevronDown
            size={12}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--text-secondary)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
