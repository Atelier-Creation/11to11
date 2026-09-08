import React from 'react';
import type { Metadata } from 'next';
import { CatalogService } from '../../../services/catalog.service';
import { CategoryView } from './CategoryView';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams: Promise<{ collection?: string }> | { collection?: string };
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams?.slug || 'all';
  const collection = resolvedSearchParams?.collection;

  const title = collection
    ? `${collection.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | 11 to 11 Capsule`
    : `${slug.charAt(0).toUpperCase() + slug.slice(1)} Collection | 11 to 11`;

  return {
    title,
    description: `Explore the 11 to 11 luxury capsule collection featuring architectural silhouettes and bespoke artisanal textiles.`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slug = resolvedParams?.slug || 'all';
  const collectionParam = resolvedSearchParams?.collection;

  const categoryParam = slug === 'all' ? undefined : slug;

  // Server-side data resolution (zero client-side waterfall)
  const productResponse = await CatalogService.getProducts({
    categorySlug: categoryParam,
    collectionSlug: collectionParam || undefined,
  });

  return (
    <CategoryView
      slug={slug}
      collectionParam={collectionParam}
      initialProducts={productResponse.items}
    />
  );
}
