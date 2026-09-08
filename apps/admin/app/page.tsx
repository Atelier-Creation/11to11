'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@11-11/ui';
import {
  TrendingUp,
  ShoppingBag,
  Truck,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Package,
} from 'lucide-react';

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerCity: string;
  itemsCount: number;
  totalAmount: number;
  status: 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  createdAt: string;
  trackingCode?: string;
}

const initialOrders: OrderItem[] = [
  {
    id: 'ord-1',
    orderNumber: '1111-2026-94812',
    customerName: 'Elena Rostova',
    customerCity: 'Mumbai',
    itemsCount: 1,
    totalAmount: 48500,
    status: 'SHIPPED',
    createdAt: 'Today, 10:30 AM',
    trackingCode: 'DLV-11TO11-882914',
  },
  {
    id: 'ord-2',
    orderNumber: '1111-2026-41902',
    customerName: 'Aarav Singhania',
    customerCity: 'New Delhi',
    itemsCount: 2,
    totalAmount: 91500,
    status: 'CONFIRMED',
    createdAt: 'Today, 11:15 AM',
  },
  {
    id: 'ord-3',
    orderNumber: '1111-2026-87214',
    customerName: 'Tara Mehta',
    customerCity: 'Bangalore',
    itemsCount: 1,
    totalAmount: 62000,
    status: 'PROCESSING',
    createdAt: 'Today, 11:45 AM',
  },
  {
    id: 'ord-4',
    orderNumber: '1111-2026-30419',
    customerName: 'Devansh Kothari',
    customerCity: 'Hyderabad',
    itemsCount: 1,
    totalAmount: 29500,
    status: 'DELIVERED',
    createdAt: 'Yesterday',
    trackingCode: 'BD-EXP-772910',
  },
];

const inventoryAudit = [
  { sku: '1111-TRN-BLK-S', title: 'Silk Organza Trench (Onyx Black / S)', stock: 8, reserved: 2 },
  { sku: '1111-TRN-BLK-M', title: 'Silk Organza Trench (Onyx Black / M)', stock: 3, reserved: 1, isLowStock: true },
  { sku: '1111-GWN-GLD-S', title: 'Pleated Column Gown (Gold / S)', stock: 4, reserved: 0 },
  { sku: '1111-COT-CML-M', title: 'Cashmere Wrap Coat (Camel / M)', stock: 2, reserved: 1, isLowStock: true },
  { sku: '1111-TNC-WHT-M', title: 'Raw Silk 11 to 11 Tunic (Chalk / M)', stock: 18, reserved: 3 },
];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [inventory, setInventory] = useState(inventoryAudit);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'shipped'>('all');

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        if (ord.status === 'CONFIRMED') return { ...ord, status: 'PROCESSING' };
        if (ord.status === 'PROCESSING') {
          return {
            ...ord,
            status: 'SHIPPED',
            trackingCode: `DLV-${Math.floor(100000 + Math.random() * 900000)}`,
          };
        }
        if (ord.status === 'SHIPPED') return { ...ord, status: 'DELIVERED' };
        return ord;
      }),
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'pending') return o.status === 'CONFIRMED' || o.status === 'PROCESSING';
    if (activeTab === 'shipped') return o.status === 'SHIPPED';
    return true;
  });

  const totalGMV = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div>
      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {/* Card 1: GMV */}
        <div style={{ backgroundColor: '#FFF', border: '1px solid var(--admin-border)', padding: '24px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
              Today's Gross Valuation
            </span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '11px',
              fontWeight: 600,
              color: '#15803D',
              backgroundColor: '#DCFCE7',
              padding: '2px 8px',
              borderRadius: '9999px',
            }}>
              <ArrowUpRight size={13} /> +32%
            </span>
          </div>
          <p style={{ fontSize: '26px', fontWeight: 700, color: '#111', margin: 0 }}>
            {formatCurrency(totalGMV)}
          </p>
          <span style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', display: 'block' }}>
            From 4 client orders
          </span>
        </div>

        {/* Card 2: Pending Fulfillments */}
        <div style={{ backgroundColor: '#FFF', border: '1px solid var(--admin-border)', padding: '24px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
              Pending Fulfillment
            </span>
            <ShoppingBag size={18} color="#D4AF37" />
          </div>
          <p style={{ fontSize: '26px', fontWeight: 700, color: '#111', margin: 0 }}>
            {orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PROCESSING').length} Orders
          </p>
          <span style={{ fontSize: '11px', color: '#B45309', marginTop: '4px', display: 'block' }}>
            Requires inspection & packaging
          </span>
        </div>

        {/* Card 3: In Transit */}
        <div style={{ backgroundColor: '#FFF', border: '1px solid var(--admin-border)', padding: '24px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
              In Courier Transit
            </span>
            <Truck size={18} color="#2563EB" />
          </div>
          <p style={{ fontSize: '26px', fontWeight: 700, color: '#111', margin: 0 }}>
            {orders.filter((o) => o.status === 'SHIPPED').length} Shipments
          </p>
          <span style={{ fontSize: '11px', color: '#15803D', marginTop: '4px', display: 'block' }}>
            Delhivery & Blue Dart Couriers
          </span>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div style={{ backgroundColor: '#FFF', border: '1px solid var(--admin-border)', padding: '24px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
              Low Stock Warnings
            </span>
            <AlertTriangle size={18} color="#DC2626" />
          </div>
          <p style={{ fontSize: '26px', fontWeight: 700, color: '#DC2626', margin: 0 }}>
            {inventory.filter((i) => i.isLowStock).length} SKUs
          </p>
          <span style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', display: 'block' }}>
            Under 3 pieces remaining in hub
          </span>
        </div>
      </div>

      {/* Main Grid: Orders Fulfillment + Stock Audit */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left: Orders Table */}
        <div style={{ backgroundColor: '#FFF', border: '1px solid var(--admin-border)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: 0 }}>
                Incoming Acquisitions & Fulfillment
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>
                Real-time orders ready for artisanal inspection and courier dispatch.
              </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: '1px solid',
                  borderColor: activeTab === 'all' ? '#111' : '#E5E7EB',
                  backgroundColor: activeTab === 'all' ? '#111' : '#FFF',
                  color: activeTab === 'all' ? '#FFF' : '#374151',
                }}
              >
                All Orders
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                style={{
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: '1px solid',
                  borderColor: activeTab === 'pending' ? '#111' : '#E5E7EB',
                  backgroundColor: activeTab === 'pending' ? '#111' : '#FFF',
                  color: activeTab === 'pending' ? '#FFF' : '#374151',
                }}
              >
                Pending Fulfillment
              </button>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Client / City</th>
                <th>Valuation</th>
                <th>Status</th>
                <th>Fulfillment Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: '#111', display: 'block' }}>
                      #{ord.orderNumber}
                    </span>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{ord.createdAt}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500, color: '#111', display: 'block' }}>
                      {ord.customerName}
                    </span>
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>
                      {ord.customerCity} • {ord.itemsCount} Garment
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(ord.totalAmount)}</span>
                  </td>
                  <td>
                    <span className={`status-badge status-${ord.status}`}>
                      ● {ord.status}
                    </span>
                    {ord.trackingCode && (
                      <span style={{ display: 'block', fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>
                        Track: {ord.trackingCode}
                      </span>
                    )}
                  </td>
                  <td>
                    {ord.status === 'CONFIRMED' && (
                      <button
                        onClick={() => advanceOrderStatus(ord.id)}
                        className="btn-admin-dark"
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        Start Inspection
                      </button>
                    )}
                    {ord.status === 'PROCESSING' && (
                      <button
                        onClick={() => advanceOrderStatus(ord.id)}
                        className="btn-admin-dark"
                        style={{ padding: '6px 12px', fontSize: '11px', backgroundColor: '#15803D' }}
                      >
                        Dispatch via Courier
                      </button>
                    )}
                    {ord.status === 'SHIPPED' && (
                      <button
                        onClick={() => advanceOrderStatus(ord.id)}
                        className="btn-admin-outline"
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        Confirm Delivered
                      </button>
                    )}
                    {ord.status === 'DELIVERED' && (
                      <span style={{ fontSize: '11px', color: '#15803D', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Warehouse Stock Overview */}
        <div style={{ backgroundColor: '#FFF', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111', margin: 0 }}>
              Warehouse Stock Audit
            </h3>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>WH-MUMBAI-MAIN</span>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginBottom: '20px' }}>
            Live stock balances and active 15-minute checkout reservation locks.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {inventory.map((item) => (
              <div
                key={item.sku}
                style={{
                  padding: '12px',
                  backgroundColor: item.isLowStock ? '#FEF2F2' : '#F9FAFB',
                  border: '1px solid',
                  borderColor: item.isLowStock ? '#FCA5A5' : '#E5E7EB',
                  borderRadius: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>
                    {item.title}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: item.isLowStock ? '#DC2626' : '#111',
                  }}>
                    {item.stock} in Hub
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280' }}>
                  <span>SKU: {item.sku}</span>
                  <span>{item.reserved > 0 ? `🔒 ${item.reserved} in active checkout` : '0 reserved'}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--admin-border)', paddingTop: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#111', display: 'block', marginBottom: '8px' }}>
              Active 11 to 11 Promotional Vouchers
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F3F4F6', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                <strong>WELCOME11</strong> (15% Off Privilege)
              </span>
              <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F3F4F6', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                <strong>11TO11_5000</strong> (₹5,000 Flat Voucher)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
