import React from 'react';
import type { Metadata } from 'next';
import { CollectionsCatalog } from './components/CollectionsCatalog';

export const metadata: Metadata = {
  title: 'The 11 to 11 Collections | Haute Editorial Capsules',
  description:
    'Explore limited capsule collections handcrafted from pure mulberry silk, wild tussar, and Mongolian cashmere in architectural silhouettes.',
};

export default function CollectionsPage() {
  return <CollectionsCatalog />;
}
