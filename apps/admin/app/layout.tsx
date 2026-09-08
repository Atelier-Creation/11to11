import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Warehouse,
  Layers,
  Tag,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '11 to 11 Console | Merchandising & Fulfillment',
  description: 'Operations control panel for the 11 to 11 luxury platform',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <aside style={{
            width: '260px',
            backgroundColor: 'var(--admin-sidebar)',
            color: '#FAF9F5',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #222',
            flexShrink: 0,
          }}>
            {/* Brand */}
            <div style={{ padding: '28px 24px', borderBottom: '1px solid #222' }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: '#FFF',
                display: 'block',
              }}>
                11 11
              </span>
              <span style={{
                fontSize: '10px',
                color: '#D4AF37',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                display: 'block',
                marginTop: '2px',
              }}>
                11 to 11 Operations Hub
              </span>
            </div>

            {/* Nav Menu */}
            <nav style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <Link href="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#E5E7EB',
                fontWeight: 500,
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}>
                <LayoutDashboard size={17} color="#D4AF37" />
                <span>Dashboard Overview</span>
              </Link>

              <Link href="/orders" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#9CA3AF',
                fontWeight: 500,
              }}>
                <ShoppingBag size={17} />
                <span>Orders & Fulfillment</span>
              </Link>

              <Link href="/inventory" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#9CA3AF',
                fontWeight: 500,
              }}>
                <Warehouse size={17} />
                <span>Inventory & Reservations</span>
              </Link>

              <Link href="/catalog" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#9CA3AF',
                fontWeight: 500,
              }}>
                <Layers size={17} />
                <span>Garment Catalog Matrix</span>
              </Link>

              <Link href="/promotions" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#9CA3AF',
                fontWeight: 500,
              }}>
                <Tag size={17} />
                <span>Vouchers & Campaigns</span>
              </Link>
            </nav>

            {/* Bottom User status */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid #222', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldCheck size={16} color="#D4AF37" />
                <span style={{ fontWeight: 600, color: '#FFF' }}>Alistair Vance</span>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '11px' }}>Super Admin Privilege</span>

              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#D4AF37',
                  fontSize: '11px',
                  marginTop: '16px',
                  textDecoration: 'none',
                }}
              >
                <span>View Live Storefront</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </aside>

          {/* Main Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Top Bar */}
            <header style={{
              height: '64px',
              backgroundColor: '#FFF',
              borderBottom: '1px solid var(--admin-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 32px',
            }}>
              <div>
                <h1 style={{ fontSize: '15px', fontWeight: 600, color: '#111' }}>
                  11 to 11 Executive Console
                </h1>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  backgroundColor: '#F0FDF4',
                  color: '#15803D',
                  borderRadius: '9999px',
                  fontWeight: 600,
                }}>
                  ● Droplet System Healthy
                </span>
              </div>
            </header>

            {/* Page Content */}
            <main style={{ flex: 1, padding: '32px' }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
