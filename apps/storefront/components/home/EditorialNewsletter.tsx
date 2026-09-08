'use client';

import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const EditorialNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '140px 24px',
        borderTop: '1px solid var(--border-light)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '64px',
          alignItems: 'end',
        }}
      >
        {/* Left: Large Editorial Headline */}
        <div>
          <span
            data-aos="fade-up"
            data-aos-delay="40"
            style={{
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold-dark)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '16px',
            }}
          >
            The 11 to 11 Dispatch
          </span>
          <h2
            data-aos="fade-up"
            data-aos-delay="100"
            className="font-serif"
            style={{
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              fontWeight: 400,
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            STAY IN THE WORLD OF 11 TO 11.
          </h2>
        </div>

        {/* Right: Minimal Underline Subscription Field with Generous Whitespace */}
        <div
          data-aos="fade-up"
          data-aos-delay="160"
          style={{ maxWidth: '520px' }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '32px',
            }}
          >
            Receive private salon invitations, limited seasonal lookbook previews, and priority access to capsule drops before public release.
          </p>

          {subscribed ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--status-success)',
                fontWeight: 500,
                padding: '16px 0',
              }}
            >
              <Check size={16} />
              <span>You are now entered into the private 11 to 11 dispatch register.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid var(--text-primary)', paddingBottom: '12px' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    padding: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span>Subscribe</span>
                  <ArrowRight size={14} />
                </button>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
                We respect your discretion. You may withdraw correspondence at any moment.
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
