'use client';

import React, { useState, useEffect } from 'react';
import { CatalogService, CatalogProduct } from '../services/catalog.service';
import { CinematicHero } from '../components/home/CinematicHero';
import { CuratedCategories } from '../components/home/CuratedCategories';
import { EditorialNewArrivals } from '../components/home/EditorialNewArrivals';
import { BrandStory } from '../components/home/BrandStory';
import { PinnedFeatures } from '../components/home/PinnedFeatures';
import { CampaignSection } from '../components/home/CampaignSection';
import { Testimonials } from '../components/Testimonials';
import { SocialEditorial } from '../components/SocialEditorial';
import { EditorialNewsletter } from '../components/home/EditorialNewsletter';

export default function HomePage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CatalogService.getProducts({ limit: 4 }).then((res) => {
      setProducts(res.items);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', overflowX: 'clip' }}>
      {/* 01. CINEMATIC HERO (88vh, fast 1.2s settling entrance, minimal UI) */}
      <CinematicHero />

      {/* 02. CURATED 11 TO 11 CATEGORIES (Compact 3-column elegant layout, 3:4 ratio) */}
      <CuratedCategories />

      {/* 03. FEATURED RUNWAY ARRIVALS (Balanced 4-column ecommerce product grid) */}
      <EditorialNewArrivals products={products} loading={loading} />

      {/* 04. BRAND STORY & CRAFT HERITAGE (2-column editorial: Image 48% | Text) */}
      <BrandStory />

      {/* 05. FEATURES OF 11TO11 (★★★ The ONE major pinned GSAP storytelling experience) */}
      <PinnedFeatures />

      {/* 06. CAMPAIGN (Compact 58vh visual transition) */}
      <CampaignSection />

      {/* 07. PATRON CHRONICLES (Black editorial quotation typography) */}
      <Testimonials />

      {/* 08. CURATED VISUAL JOURNAL (@11to11 compact editorial grid) */}
      <SocialEditorial />

      {/* 09. BENEFITS (Compact Indian Client Confidence Strip) */}
      <section
        style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '72px 24px',
          borderTop: '1px solid var(--border-light)',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '36px',
            }}
          >
            <div data-aos="fade-up" data-aos-delay="80">
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                ₹0 White-Glove Delivery
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                Complimentary insured courier to every serviced postal pincode across India on all 11 to 11 orders.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="160">
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                UPI &amp; Secure NetBanking
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                Instant frictionless checkout via Google Pay, PhonePe, Paytm, RuPay, and all major Indian banking cards.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="240">
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                7-Day Complimentary Exchange
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                Bespoke fit guarantee. Hassle-free exchanges or size adjustments arranged directly by our client concierge.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="320">
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Pure Certified Fabrics
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                Every garment is accompanied by an authenticity certificate detailing fiber origin, momme weight, and artisan weaver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. NEWSLETTER (Minimalist Typographic Dispatch) */}
      <EditorialNewsletter />
    </div>
  );
}
