import { apiClient } from './api-client';

export interface CatalogProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  details?: string;
  material?: string;
  careInstructions?: string;
  price: number;
  compareAtPrice?: number | null;
  category: {
    id?: string;
    name: string;
    slug: string;
  };
  collection?: {
    id?: string;
    name: string;
    slug: string;
  };
  badge?: string;
  images: {
    id?: string;
    url: string;
    altText?: string;
    isPrimary?: boolean;
    colorName?: string;
  }[];
  variants: {
    id: string;
    sku: string;
    colorName: string;
    colorHex: string;
    size: string;
    price: number;
    compareAtPrice?: number;
    availableQuantity?: number;
  }[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
}

export interface ProductListResponse {
  items: CatalogProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Fallback luxury fashion catalog for seamless storefront experience
export const fallbackProducts: CatalogProduct[] = [
  {
    id: 'prod-1',
    title: 'The Sovereign Silk Organza Trench',
    slug: 'sovereign-silk-organza-trench',
    category: { name: 'Tailored Outerwear', slug: 'tailored-outerwear' },
    collection: { name: 'Autumn / Winter: Noir Opulence', slug: 'noir-opulence' },
    price: 48500,
    compareAtPrice: 54000,
    badge: '11 to 11 Signature',
    description: 'A masterpiece of sheer architectural tailoring. Cut from translucent mulberry silk organza with exaggerated storm flaps, horn buttons, and a sculpted belted waist that defines modern haute outerwear.',
    details: 'Storm flap detailing. Double-breasted closure with genuine horn buttons. Raglan sleeves with adjustable buckle cuffs. Hand-finished French seams throughout.',
    material: '100% Mulberry Silk Organza (45 Momme)',
    careInstructions: 'Dry clean only by luxury garment specialist. Cool iron with pressing cloth.',
    images: [
      { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop', isPrimary: true, altText: 'Silk Organza Trench front portrait' },
      { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', isPrimary: false, altText: 'Silk Organza Trench movement profile' },
    ],
    colors: [
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Ivory Cream', hex: '#F7F5F0' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    variants: [
      { id: 'sku-1-s', sku: '1111-TRN-BLK-S', colorName: 'Onyx Black', colorHex: '#111111', size: 'S', price: 48500, availableQuantity: 5 },
      { id: 'sku-1-m', sku: '1111-TRN-BLK-M', colorName: 'Onyx Black', colorHex: '#111111', size: 'M', price: 48500, availableQuantity: 4 },
      { id: 'sku-1-l', sku: '1111-TRN-BLK-L', colorName: 'Onyx Black', colorHex: '#111111', size: 'L', price: 48500, availableQuantity: 2 },
    ],
  },
  {
    id: 'prod-2',
    title: 'Crepe de Chine Pleated Column Gown',
    slug: 'crepe-de-chine-pleated-column-gown',
    category: { name: 'Eveningwear & Gowns', slug: 'eveningwear-gowns' },
    collection: { name: 'Autumn / Winter: Noir Opulence', slug: 'noir-opulence' },
    price: 62000,
    compareAtPrice: null,
    badge: 'Limited Edition',
    description: 'Floor-skimming columnar silhouette hand-pleated in heavy silk crepe. Features an asymmetric shoulder drape and discreet side slit for an arresting entrance.',
    details: 'Hand-pressed accordion pleats. Concealed side zip closure with hook-and-eye. Fully lined in silk habotai.',
    material: '100% Silk Crepe de Chine',
    careInstructions: 'Specialist dry clean only. Store hung on padded hanger.',
    images: [
      { url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop', isPrimary: true, altText: 'Pleated Column Gown in champagne' },
      { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop', isPrimary: false, altText: 'Pleated Column Gown back details' },
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#E5D3B3' },
      { name: 'Noir Midnight', hex: '#111111' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    variants: [
      { id: 'sku-2-xs', sku: '1111-GWN-GLD-XS', colorName: 'Champagne Gold', colorHex: '#E5D3B3', size: 'XS', price: 62000, availableQuantity: 2 },
      { id: 'sku-2-s', sku: '1111-GWN-GLD-S', colorName: 'Champagne Gold', colorHex: '#E5D3B3', size: 'S', price: 62000, availableQuantity: 3 },
      { id: 'sku-2-m', sku: '1111-GWN-GLD-M', colorName: 'Champagne Gold', colorHex: '#E5D3B3', size: 'M', price: 62000, availableQuantity: 5 },
    ],
  },
  {
    id: 'prod-3',
    title: 'Sculpted Double-Faced Cashmere Coat',
    slug: 'sculpted-double-faced-cashmere-coat',
    category: { name: 'Tailored Outerwear', slug: 'tailored-outerwear' },
    collection: { name: 'Autumn / Winter: Noir Opulence', slug: 'noir-opulence' },
    price: 89000,
    compareAtPrice: 98000,
    badge: 'Pure Cashmere',
    description: 'Hand-stitched double-faced Mongolian cashmere unlined coat. Unsurpassed softness and weightless thermal insulation with a dramatic lapel and kimono sleeve.',
    details: 'Hand-sewn edges. Self-tie cashmere belt. Deep patch pockets. Unlined for natural drape.',
    material: '100% Grade-A Mongolian Cashmere (750 GSM)',
    careInstructions: 'Professional furrier/cashmere clean only.',
    images: [
      { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop', isPrimary: true, altText: 'Cashmere coat portrait' },
      { url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200&auto=format&fit=crop', isPrimary: false, altText: 'Cashmere coat silhouette' },
    ],
    colors: [
      { name: 'Camel Melange', hex: '#C19A6B' },
      { name: 'Onyx Black', hex: '#111111' },
    ],
    sizes: ['S', 'M', 'L'],
    variants: [
      { id: 'sku-3-s', sku: '1111-COA-CAM-S', colorName: 'Camel Melange', colorHex: '#C19A6B', size: 'S', price: 89000, availableQuantity: 4 },
      { id: 'sku-3-m', sku: '1111-COA-CAM-M', colorName: 'Camel Melange', colorHex: '#C19A6B', size: 'M', price: 89000, availableQuantity: 2 },
    ],
  },
  {
    id: 'prod-4',
    title: 'Raw Silk Draped 11 to 11 Tunic',
    slug: 'raw-silk-draped-11-to-11-tunic',
    category: { name: 'Handcrafted Silk', slug: 'handcrafted-silk' },
    collection: { name: 'The Raw Silk Capsule', slug: 'raw-silk-capsule' },
    price: 29500,
    compareAtPrice: null,
    badge: 'Artisanal Loom',
    description: 'Fluid artisanal tunic featuring a cowl collar and stepped hemline. Woven on traditional handlooms preserving natural slub irregularities.',
    details: 'Handwoven raw silk texture. Extended side vents. Hand-rolled hems.',
    material: '100% Wild Tussar Silk',
    careInstructions: 'Dry clean recommended. Gentle hand wash in cold water using silk detergent.',
    images: [
      { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', isPrimary: true, altText: 'Raw Silk Tunic portrait' },
      { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop', isPrimary: false, altText: 'Raw Silk Tunic texture' },
    ],
    colors: [
      { name: 'Chalk White', hex: '#EAE6DF' },
      { name: 'Raw Ochre', hex: '#C68B59' },
    ],
    sizes: ['S', 'M', 'L'],
    variants: [
      { id: 'sku-4-s', sku: '1111-TUN-CHK-S', colorName: 'Chalk White', colorHex: '#EAE6DF', size: 'S', price: 29500, availableQuantity: 7 },
      { id: 'sku-4-m', sku: '1111-TUN-CHK-M', colorName: 'Chalk White', colorHex: '#EAE6DF', size: 'M', price: 29500, availableQuantity: 5 },
    ],
  },
  {
    id: 'prod-5',
    title: 'Structured Barathea Wool Tuxedo Blazer',
    slug: 'structured-barathea-wool-tuxedo-blazer',
    category: { name: 'Tailored Outerwear', slug: 'tailored-outerwear' },
    collection: { name: 'Autumn / Winter: Noir Opulence', slug: 'noir-opulence' },
    price: 52000,
    compareAtPrice: 58000,
    badge: '11 to 11 Tailoring',
    description: 'Sharply defined peak-lapel tuxedo jacket crafted in high-twist barathea wool with grosgrain lapel facing and silk-bound interior seams.',
    details: 'Peak grosgrain lapels. Single button fastening. Padded architectural shoulders.',
    material: '100% Super 140s Wool Barathea',
    careInstructions: 'Specialist dry clean only.',
    images: [
      { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop', isPrimary: true, altText: 'Tuxedo Blazer front view' },
      { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', isPrimary: false, altText: 'Tuxedo Blazer shoulder line' },
    ],
    colors: [{ name: 'Deep Onyx', hex: '#111111' }],
    sizes: ['38', '40', '42', '44'],
    variants: [
      { id: 'sku-5-38', sku: '1111-BLZ-BLK-38', colorName: 'Deep Onyx', colorHex: '#111111', size: '38', price: 52000, availableQuantity: 3 },
      { id: 'sku-5-40', sku: '1111-BLZ-BLK-40', colorName: 'Deep Onyx', colorHex: '#111111', size: '40', price: 52000, availableQuantity: 6 },
    ],
  },
  {
    id: 'prod-6',
    title: 'Zari Bordered Chanderi Cape Overlay',
    slug: 'zari-bordered-chanderi-cape-overlay',
    category: { name: 'Handcrafted Silk', slug: 'handcrafted-silk' },
    collection: { name: 'The Heritage Edition', slug: 'heritage-edition' },
    price: 36000,
    compareAtPrice: null,
    badge: 'Artisanal Zari',
    description: 'Ethereal sheer Chanderi silk cape with hand-spun genuine silver-gilt zari border selvedge. Designed to layer dramatically over gowns or tailored trousers.',
    details: 'Woven on pit looms in Madhya Pradesh. Hand-knotted fringe edges. Free-flowing silhouette.',
    material: '70% Silk, 30% Cotton with Metallic Zari',
    careInstructions: 'Dry clean only. Do not bleach or tumble dry.',
    images: [
      { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop', isPrimary: true, altText: 'Zari Cape drape portrait' },
      { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', isPrimary: false, altText: 'Zari detail close up' },
    ],
    colors: [{ name: 'Champagne Silver', hex: '#D1C7B7' }],
    sizes: ['One Size'],
    variants: [
      { id: 'sku-6-os', sku: '1111-CPE-SLV-OS', colorName: 'Champagne Silver', colorHex: '#D1C7B7', size: 'One Size', price: 36000, availableQuantity: 8 },
    ],
  },
];

export const CatalogService = {
  async getProducts(params: {
    categorySlug?: string;
    collectionSlug?: string;
    sortBy?: 'price_asc' | 'price_desc' | 'newest';
    page?: number;
    limit?: number;
  } = {}): Promise<ProductListResponse> {
    try {
      const res = await apiClient<any>('/catalog/products', { params });
      if (res && Array.isArray(res.items) && res.items.length > 0) {
        return res;
      }
    } catch (e) {
      // Fallback gracefully
    }

    // Filter fallback data
    let items = [...fallbackProducts];
    if (params.categorySlug) {
      items = items.filter((p) => p.category.slug === params.categorySlug);
    }
    if (params.collectionSlug) {
      items = items.filter((p) => p.collection?.slug === params.collectionSlug);
    }
    if (params.sortBy === 'price_asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (params.sortBy === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    }

    return {
      items,
      total: items.length,
      page: params.page || 1,
      limit: params.limit || 12,
      totalPages: 1,
    };
  },

  async getProductBySlug(slug: string): Promise<CatalogProduct | null> {
    try {
      const res = await apiClient<CatalogProduct>(`/catalog/products/${slug}`);
      if (res && res.id) return res;
    } catch (e) {
      // Fallback
    }

    const found = fallbackProducts.find((p) => p.slug === slug);
    return found || null;
  },

  async getCategories() {
    try {
      const res = await apiClient<any[]>('/catalog/categories');
      if (Array.isArray(res) && res.length > 0) return res;
    } catch (e) {
      // Fallback
    }

    return [
      { name: 'Tailored Outerwear', slug: 'tailored-outerwear', count: 3 },
      { name: 'Eveningwear & Gowns', slug: 'eveningwear-gowns', count: 2 },
      { name: 'Handcrafted Silk', slug: 'handcrafted-silk', count: 2 },
      { name: 'Autumn / Winter', slug: 'autumn-winter', count: 4 },
    ];
  },

  async getCollections() {
    try {
      const res = await apiClient<any[]>('/catalog/collections');
      if (Array.isArray(res) && res.length > 0) return res;
    } catch (e) {
      // Fallback
    }

    return [
      { name: 'Autumn / Winter: Noir Opulence', slug: 'noir-opulence', description: 'Architectural silhouettes crafted in raw silk and Mongolian cashmere.' },
      { name: 'The Raw Silk Capsule', slug: 'raw-silk-capsule', description: 'Indigenous tussar silks woven on artisanal pit looms.' },
      { name: 'The Heritage Edition', slug: 'heritage-edition', description: 'Subtle metallic zari selvedges celebrating royal Indian textile origins.' },
    ];
  },
};
