'use client';

import React, { useState, useMemo } from 'react';
import { COLLECTIONS_DATA, FilterCategory, SortMode } from '../data/collections.data';
import { CollectionsHero } from './CollectionsHero';
import { CollectionToolbar } from './CollectionToolbar';
import { CollectionsGrid } from './CollectionsGrid';
import { PhilosophyBanner } from './PhilosophyBanner';
import { ValuePillars } from './ValuePillars';

export const CollectionsCatalog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('ALL COLLECTIONS');
  const [sortBy, setSortBy] = useState<SortMode>('featured');

  // Dynamic filter and sort
  const filteredCollections = useMemo(() => {
    let list = COLLECTIONS_DATA.filter((cap) => {
      if (activeCategory === 'ALL COLLECTIONS') return true;
      return cap.tags.includes(activeCategory);
    });

    if (sortBy === 'capsule_asc') {
      list = [...list].sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortBy === 'capsule_desc') {
      list = [...list].sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [activeCategory, sortBy]);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* 1. Haute Editorial Hero */}
      <CollectionsHero />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 80px 24px' }}>

        {/* 2. Interactive Filter Tabs & Sort Toolbar */}
        <CollectionToolbar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* 3. GSAP Orchestrated Responsive Grid */}
        <CollectionsGrid
          collections={filteredCollections}
          activeCategory={activeCategory}
        />

        {/* 4. Philosophy Split Banner */}
        <PhilosophyBanner />

        {/* 5. Value Assurance Pillars */}
        <ValuePillars />
      </div>
    </div>
  );
};
