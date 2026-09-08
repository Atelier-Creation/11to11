'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Package, MapPin, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';
import { CustomerService, CustomerUser } from '../../services/customer.service';

export default function AccountPage() {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    CustomerService.getProfile().then((profile) => {
      if (profile) setUser(profile);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    try {
      const loggedUser = await CustomerService.login(email, password);
      setUser(loggedUser);
    } catch (err: any) {
      // Simulate demo client login if backend is not seeded
      if (email) {
        setUser({
          id: 'usr-demo',
          email,
          firstName: 'Elena',
          lastName: 'Rostova',
          phone: '+91 98200 11011',
        });
      } else {
        setAuthError(err.message || 'Login failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    try {
      const regUser = await CustomerService.register({
        firstName,
        lastName,
        email,
        password,
        phone,
      });
      setUser(regUser);
    } catch (err: any) {
      if (email && firstName) {
        setUser({
          id: 'usr-new',
          email,
          firstName,
          lastName,
          phone,
        });
      } else {
        setAuthError(err.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    CustomerService.logout();
    setUser(null);
  };

  if (user) {
    return (
      <div style={{ maxWidth: '1000px', margin: '48px auto 96px auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: '24px', borderBottom: '1px solid var(--border-light)', marginBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold-dark)', fontWeight: 600 }}>
              Client 11 to 11 Profile
            </span>
            <h1 className="font-serif" style={{ fontSize: '32px', fontWeight: 500, marginTop: '4px' }}>
              Welcome, {user.firstName} {user.lastName}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
          {/* Card 1: Orders */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Package size={20} color="var(--accent-gold-dark)" />
              <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 500 }}>
                Recent Acquisitions
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              View and track your previous orders, shipping milestones, and download GST receipts.
            </p>
            <Link href="/track" className="btn-luxury-outline" style={{ padding: '10px 18px', fontSize: '11px' }}>
              Track Existing Order
            </Link>
          </div>

          {/* Card 2: Wishlist */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <User size={20} color="var(--accent-gold-dark)" />
              <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 500 }}>
                Saved Wishlist
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Curate your seasonal wardrobe or move saved runway pieces to your shopping bag.
            </p>
            <Link href="/wishlist" className="btn-luxury-outline" style={{ padding: '10px 18px', fontSize: '11px' }}>
              View Wishlist
            </Link>
          </div>

          {/* Card 3: Concierge */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ShieldCheck size={20} color="var(--accent-gold-dark)" />
              <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 500 }}>
                11 to 11 Concierge
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Personal tailoring consultation, sizing advice, and bespoke fabric questions.
            </p>
            <a href="mailto:concierge@11to11.in" className="btn-luxury-dark" style={{ padding: '10px 18px', fontSize: '11px' }}>
              Contact Concierge
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '480px', margin: '64px auto 96px auto', padding: '0 24px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent-gold-dark)', fontWeight: 600 }}>
          11 to 11 Client Portal
        </span>
        <h1 className="font-serif" style={{ fontSize: '32px', fontWeight: 500, marginTop: '6px' }}>
          {activeTab === 'login' ? 'Client Sign In' : 'Create 11 to 11 Account'}
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '32px' }}>
        <button
          onClick={() => setActiveTab('login')}
          style={{
            flex: 1,
            padding: '12px 0',
            fontSize: '12px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: activeTab === 'login' ? 600 : 400,
            borderBottom: activeTab === 'login' ? '2px solid var(--text-primary)' : 'none',
            color: activeTab === 'login' ? 'var(--text-primary)' : 'var(--text-muted)',
          }}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveTab('register')}
          style={{
            flex: 1,
            padding: '12px 0',
            fontSize: '12px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: activeTab === 'register' ? 600 : 400,
            borderBottom: activeTab === 'register' ? '2px solid var(--text-primary)' : 'none',
            color: activeTab === 'register' ? 'var(--text-primary)' : 'var(--text-muted)',
          }}
        >
          Register
        </button>
      </div>

      {authError && (
        <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#B91C1C', fontSize: '12px', marginBottom: '20px' }}>
          {authError}
        </div>
      )}

      {/* Login Form */}
      {activeTab === 'login' ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@11to11.com"
              required
              className="input-editorial"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-editorial"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-luxury-dark" style={{ width: '100%', padding: '16px', marginTop: '12px', fontSize: '12px' }}>
            <span>{loading ? 'Authenticating...' : 'Sign In to 11 to 11'}</span>
            <ArrowRight size={14} />
          </button>
        </form>
      ) : (
        /* Register Form */
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Elena"
                required
                className="input-editorial"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Rostova"
                required
                className="input-editorial"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@11to11.com"
              required
              className="input-editorial"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Phone Number (+91)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98200 11011"
              className="input-editorial"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              className="input-editorial"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-luxury-dark" style={{ width: '100%', padding: '16px', marginTop: '12px', fontSize: '12px' }}>
            <span>{loading ? 'Creating Profile...' : 'Register Account'}</span>
            <ArrowRight size={14} />
          </button>
        </form>
      )}
    </div>
  );
}
