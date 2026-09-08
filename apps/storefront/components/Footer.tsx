'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#111111',
        color: '#FAF9F5',
        paddingTop: '64px',
        paddingBottom: '40px',
        marginTop: 'auto',
        borderTop: '1px solid #222222',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* Trust Credentials Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            paddingBottom: '48px',
            borderBottom: '1px solid #222222',
            marginBottom: '48px',
          }}
        >
          <div data-aos="fade-up" data-aos-delay="80" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ color: '#D4AF37' }}>
              <Truck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Complimentary Shipping
              </div>
              <div style={{ fontSize: '12px', color: '#9E968D', marginTop: '2px' }}>
                Insured white-glove courier across all Indian states & territories
              </div>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="160" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ color: '#D4AF37' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Certified Provenance
              </div>
              <div style={{ fontSize: '12px', color: '#9E968D', marginTop: '2px' }}>
                Handcrafted pure mulberry silk & Mongolian cashmere
              </div>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="240" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ color: '#D4AF37' }}>
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                11 to 11 Client Care
              </div>
              <div style={{ fontSize: '12px', color: '#9E968D', marginTop: '2px' }}>
                Dedicated styling consultation & tracking support
              </div>
            </div>
          </div>
        </div>

        {/* 5-Column Grid */}
        <div
          data-aos="fade-up"
          data-aos-delay="120"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Column 1: Brand 11 to 11 */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <Image
                src="/11-11_logo.png"
                alt="11 to 11 - Style Around The Clock"
                width={160}
                height={54}
                style={{
                  height: 'auto',
                  maxHeight: '38px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </Link>
            <p style={{ fontSize: '12px', color: '#9E968D', lineHeight: 1.6 }}>
              A contemporary Indian luxury house crafting architectural silhouettes from indigenous silks and artisanal textiles.
            </p>
          </div>

          {/* Column 2: Collections */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '18px', color: '#D4AF37' }}>
              Collections
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <Link href="/category/tailored-outerwear" style={{ color: '#C5BFB8', transition: 'color 0.2s' }}>
                  Tailored Outerwear
                </Link>
              </li>
              <li>
                <Link href="/category/eveningwear-gowns" style={{ color: '#C5BFB8', transition: 'color 0.2s' }}>
                  Eveningwear & Gowns
                </Link>
              </li>
              <li>
                <Link href="/category/handcrafted-silk" style={{ color: '#C5BFB8', transition: 'color 0.2s' }}>
                  Silk Collection
                </Link>
              </li>
              <li>
                <Link href="/collections" style={{ color: '#C5BFB8', transition: 'color 0.2s' }}>
                  Autumn / Winter Runway
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Care */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '18px', color: '#D4AF37' }}>
              Client Care
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <Link href="/track" style={{ color: '#C5BFB8', transition: 'color 0.2s' }}>
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/account" style={{ color: '#C5BFB8', transition: 'color 0.2s' }}>
                  Client Profile
                </Link>
              </li>
              <li>
                <Link href="/wishlist" style={{ color: '#C5BFB8', transition: 'color 0.2s' }}>
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <span style={{ color: '#C5BFB8' }}>Pincode Transit Times</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Transparency & Legal */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '18px', color: '#D4AF37' }}>
              Transparency
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <span style={{ color: '#9E968D' }}>Prices Inclusive of GST</span>
              </li>
              <li>
                <span style={{ color: '#9E968D' }}>Pure Silk Certified</span>
              </li>
              <li>
                <span style={{ color: '#9E968D' }}>Secure UPI & 256-Bit SSL</span>
              </li>
              <li>
                <span style={{ color: '#9E968D' }}>7-Day Return Policy</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div style={{ minWidth: '240px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '18px', color: '#D4AF37' }}>
              The 11 to 11 Dispatch
            </div>
            <p style={{ fontSize: '12px', color: '#9E968D', marginBottom: '14px', lineHeight: 1.5 }}>
              Receive invitations to private runway previews and limited capsule drops.
            </p>
            {subscribed ? (
              <div style={{ fontSize: '12px', color: '#D4AF37', padding: '10px', border: '1px solid #D4AF37' }}>
                Thank you. You have been registered for private 11 to 11 dispatches.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} style={{ display: 'flex' }}>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    backgroundColor: '#1E1E1E',
                    border: '1px solid #2A2A2A',
                    color: '#FAF9F5',
                    padding: '12px 14px',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                    flex: 1,
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#111',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar with Indian Payment Badges */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid #2A2A2A',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '11px',
            color: '#8A847C',
          }}
        >
          <div>© {new Date().getFullYear()} 11 to 11 Pvt. Ltd. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span>INR (₹) Indian Rupee</span>
            <span>•</span>
            <span>UPI (GPay / PhonePe)</span>
            <span>•</span>
            <span>RuPay / Visa / MasterCard</span>
            <span>•</span>
            <span>NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
