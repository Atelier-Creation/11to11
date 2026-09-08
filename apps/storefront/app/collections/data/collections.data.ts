export interface CollectionRecord {
  id: string;
  capsuleNumber: string;
  titleLine1: string;
  titleLine2?: string;
  description: string;
  imageUrl: string;
  href: string;
  category: 'OUTERWEAR' | 'EVENINGWEAR' | 'SILK COLLECTION' | 'RUNWAY' | 'HERITAGE';
  tags: string[];
}

export const FILTER_CATEGORIES = [
  'ALL COLLECTIONS',
  'OUTERWEAR',
  'EVENINGWEAR',
  'SILK COLLECTION',
  'RUNWAY',
  'HERITAGE',
] as const;

export type FilterCategory = (typeof FILTER_CATEGORIES)[number];
export type SortMode = 'featured' | 'capsule_asc' | 'capsule_desc';

export const COLLECTIONS_DATA: CollectionRecord[] = [
  {
    id: 'noir-opulence',
    capsuleNumber: 'CAPSULE #1',
    titleLine1: 'Autumn / Winter:',
    titleLine2: 'Noir Opulence',
    description: 'Architectural silhouettes crafted in raw silk and Mongolian cashmere.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200',
    href: '/category/all?collection=noir-opulence',
    category: 'OUTERWEAR',
    tags: ['ALL COLLECTIONS', 'OUTERWEAR', 'RUNWAY'],
  },
  {
    id: 'raw-silk-capsule',
    capsuleNumber: 'CAPSULE #2',
    titleLine1: 'The Raw Silk',
    titleLine2: 'Capsule',
    description: 'Indigenous tussar silks woven on artisanal pit looms.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200',
    href: '/category/all?collection=raw-silk-capsule',
    category: 'SILK COLLECTION',
    tags: ['ALL COLLECTIONS', 'SILK COLLECTION', 'HERITAGE'],
  },
  {
    id: 'heritage-edition',
    capsuleNumber: 'CAPSULE #3',
    titleLine1: 'The Heritage',
    titleLine2: 'Edition',
    description: 'Subtle metallic zari selvedges celebrating royal Indian textile origins.',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200',
    href: '/category/all?collection=heritage-edition',
    category: 'HERITAGE',
    tags: ['ALL COLLECTIONS', 'HERITAGE', 'SILK COLLECTION'],
  },
  {
    id: 'modern-outerwear',
    capsuleNumber: 'CAPSULE #4',
    titleLine1: 'The Modern',
    titleLine2: 'Outerwear',
    description: 'Refined layers for contemporary wardrobes.',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200',
    href: '/category/outerwear',
    category: 'OUTERWEAR',
    tags: ['ALL COLLECTIONS', 'OUTERWEAR', 'RUNWAY'],
  },
  {
    id: 'evening-expressions',
    capsuleNumber: 'CAPSULE #5',
    titleLine1: 'Evening',
    titleLine2: 'Expressions',
    description: 'Timeless silhouettes for extraordinary nights.',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200',
    href: '/category/eveningwear',
    category: 'EVENINGWEAR',
    tags: ['ALL COLLECTIONS', 'EVENINGWEAR', 'RUNWAY'],
  },
  {
    id: 'silk-atelier',
    capsuleNumber: 'CAPSULE #6',
    titleLine1: 'Silk Atelier',
    titleLine2: '',
    description: 'A study in texture, light and movement.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200',
    href: '/category/all?collection=silk-atelier',
    category: 'SILK COLLECTION',
    tags: ['ALL COLLECTIONS', 'SILK COLLECTION', 'HERITAGE'],
  },
];
