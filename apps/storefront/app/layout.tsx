import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import 'aos/dist/aos.css';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { StorefrontShell } from '../components/StorefrontShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://11to11.in'),
  title: {
    default: '11 to 11 | Style Around The Clock - Contemporary Luxury Fashion',
    template: '%s | 11 to 11',
  },
  description:
    '11 to 11 is an editorial luxury fashion house crafting architectural outerwear, wild mulberry silk tunics, and sculpted eveningwear in limited editions.',
  keywords: [
    '11 to 11',
    '11to11',
    'Indian luxury fashion',
    'mulberry silk trench',
    'handcrafted silk gowns',
    'cashmere coats',
    'contemporary Indian ready to wear',
  ],
  openGraph: {
    title: '11 to 11 | Style Around The Clock - Contemporary Luxury Fashion',
    description: 'Architectural outerwear, wild mulberry silk tunics, and sculpted eveningwear in limited editions.',
    url: 'https://11to11.in',
    siteName: '11 to 11',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: '11 to 11 Runway Campaign',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '11 to 11 | Contemporary Fashion & Ready-to-Wear',
    description: 'Architectural silhouettes and artisanal heritage textiles.',
    images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Organization JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: '11 to 11',
              url: 'https://11to11.in',
              logo: 'https://11to11.in/11-11_logo.png',
              sameAs: [
                'https://instagram.com/11to11',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-98200-11011',
                contactType: 'Customer Care & Concierge',
                areaServed: 'IN',
                availableLanguage: ['English', 'Hindi'],
              },
            }),
          }}
        />
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            <StorefrontShell>{children}</StorefrontShell>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
