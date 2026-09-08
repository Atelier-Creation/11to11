'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, User, Heart, Menu, X, ChevronRight } from 'lucide-react';
import { TransitionLink } from './motion/TransitionLink';
import { useWishlist } from '../context/WishlistContext';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Collections', href: '/collections' },
    { label: 'Outerwear', href: '/category/tailored-outerwear' },
    { label: 'Eveningwear', href: '/category/eveningwear-gowns' },
    { label: 'Silk Collection', href: '/category/handcrafted-silk' },
  ];

  // High-contrast, visible text colors adhering to design-system/MASTER.md
  const textColor = 'var(--text-primary)'; // #111111 Noir
  const secondaryColor = 'var(--text-secondary)'; // #6E6862

  return (
    <>
      {/* Top Announcement Ticker */}
      <div
        style={{
          backgroundColor: '#111111',
          color: '#D4AF37',
          fontSize: '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          textAlign: 'center',
          padding: '8px 16px',
          fontWeight: 500,
          borderBottom: '1px solid #1c1c1c',
          position: 'relative',
          zIndex: 101,
        }}
      >
        Complimentary Insured White-Glove Delivery Across India | 11 to 11 Privilege Consultation
      </div>

      {/* Main Architectural Header */}
      <header
        className={`header-solid ${scrolled ? 'is-scrolled' : 'is-top'}`}
      >
        <div className="header-inner">
          {/* Left: Mobile Hamburger & Desktop Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', zIndex: 1 }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                color: textColor,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              className="md:hidden"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>

            <nav
              style={{
                gap: '24px',
                alignItems: 'center',
              }}
              className="md:flex"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: textColor,
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Mathematically Centered Brand Logo (50% of viewport width) */}
          <div
            id="header-logo"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              zIndex: 2,
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link href="/" aria-label="11 to 11 Home" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src="/11-11_logo.png"
                alt="11 to 11 - Style Around The Clock"
                width={160}
                height={54}
                priority
                className="header-logo-image"
                style={{
                  height: scrolled ? '34px' : '42px',
                  width: 'auto',
                  objectFit: 'contain',
                  transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'block',
                }}
              />
            </Link>
          </div>

          {/* Right: Utility Actions (100% visible, high-contrast) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              zIndex: 1,
            }}
          >
            {/* Search Trigger or Inline Field */}
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    border: 'none',
                    borderBottom: `1px solid ${textColor}`,
                    backgroundColor: 'transparent',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                    width: '150px',
                    outline: 'none',
                    color: textColor,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  style={{ marginLeft: '4px', color: textColor, background: 'transparent', border: 'none', cursor: 'pointer' }}
                  aria-label="Close search"
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                style={{ color: textColor, padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                aria-label="Search collection"
              >
                <Search size={18} />
              </button>
            )}

            {/* Wishlist Link */}
            <TransitionLink
              href="/wishlist"
              transitionLabel="CURATING WISHLIST"
              style={{
                color: textColor,
                padding: '6px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="View Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '-4px',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#111111',
                    fontSize: '9px',
                    fontWeight: 700,
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </TransitionLink>

            {/* Account / Login Link */}
            <TransitionLink
              href="/account"
              transitionLabel="CLIENT PRIVILEGE CONCIERGE"
              style={{ color: textColor, padding: '6px', display: 'flex', alignItems: 'center' }}
              aria-label="Customer Account and Sign In"
              title="Account & Orders"
            >
              <User size={18} />
            </TransitionLink>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              style={{
                color: textColor,
                padding: '6px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '-4px',
                    backgroundColor: 'var(--text-primary)',
                    color: '#FFFFFF',
                    fontSize: '9px',
                    fontWeight: 600,
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 250 }}>
          <div
            className="drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            style={{ opacity: 1 }}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '85%',
              maxWidth: '360px',
              backgroundColor: 'var(--bg-primary)',
              zIndex: 251,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-drawer)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Image
                  src="/11-11_logo.png"
                  alt="11 to 11"
                  width={130}
                  height={44}
                  style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                />
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '16px 0',
                    borderBottom: '1px solid var(--border-light)',
                    fontSize: '13px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '48px',
                    color: 'var(--text-primary)',
                  }}
                >
                  <span>{link.label}</span>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </Link>
              ))}

              <Link
                href="/track"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '16px 0',
                  borderBottom: '1px solid var(--border-light)',
                  fontSize: '13px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: '48px',
                  color: 'var(--text-primary)',
                }}
              >
                <span>Track Order</span>
                <ChevronRight size={16} color="var(--text-muted)" />
              </Link>

              <TransitionLink
                href="/wishlist"
                transitionLabel="CURATING WISHLIST"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '16px 0',
                  borderBottom: '1px solid var(--border-light)',
                  fontSize: '13px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: '48px',
                  color: 'var(--text-primary)',
                }}
              >
                <span>Curated Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}</span>
                <ChevronRight size={16} color="var(--text-muted)" />
              </TransitionLink>

              <TransitionLink
                href="/account"
                transitionLabel="CLIENT PRIVILEGE CONCIERGE"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '16px 0',
                  borderBottom: '1px solid var(--border-light)',
                  fontSize: '13px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: '48px',
                  color: 'var(--text-primary)',
                }}
              >
                <span>Client Account &amp; Sign In</span>
                <ChevronRight size={16} color="var(--text-muted)" />
              </TransitionLink>
            </div>

            <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-light)', fontSize: '11px', color: 'var(--text-muted)' }}>
              Curated Haute Couture &amp; Contemporary Ready-to-Wear — 11 to 11.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
