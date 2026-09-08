'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  Building,
  Banknote,
} from 'lucide-react';
import { formatCurrency } from '@11-11/ui';
import { useCart } from '../../context/CartContext';
import { OrderService } from '../../services/order.service';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Delhi NCR',
  'Goa',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, shippingFee, grandTotal, appliedCoupon, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    country: 'IN',
    customerNote: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('UPI');
  const [upiVpa, setUpiVpa] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in your contact information.');
      return;
    }

    if (!formData.streetLine1.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      setErrorMessage('Please complete your delivery address details.');
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(formData.postalCode.trim())) {
      setErrorMessage('Please enter a valid 6-digit Indian postal pincode.');
      return;
    }

    setIsProcessing(true);

    try {
      const order = await OrderService.checkout({
        cartId: 'cart-' + Date.now(),
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          streetLine1: formData.streetLine1,
          streetLine2: formData.streetLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: 'India',
        },
        paymentGateway: 'RAZORPAY',
        customerNote: formData.customerNote,
      });

      clearCart();
      router.push(`/checkout/success?orderNumber=${encodeURIComponent(order.orderNumber)}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing could not be initiated. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '640px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <h2 className="font-serif" style={{ fontSize: '24px', marginBottom: '16px' }}>
          Your Bag is Empty
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Please add garments to your shopping bag before proceeding to checkout.
        </p>
        <Link href="/collections" className="btn-luxury-dark">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 96px 24px' }}>
      {/* Checkout Minimalist Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
        <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={14} />
          <span>Return to Bag</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          <Lock size={12} />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      {errorMessage && (
        <div style={{ padding: '14px 18px', backgroundColor: '#FEE2E2', border: '1px solid #F87171', color: '#B91C1C', fontSize: '13px', marginBottom: '28px' }}>
          {errorMessage}
        </div>
      )}

      {/* Main Grid: Form Left (7-col) + Summary Right (5-col) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'start' }}>
        {/* Left: Checkout Form */}
        <form onSubmit={handlePlaceOrder}>
          {/* Section 1: Contact Details */}
          <div style={{ marginBottom: '40px' }}>
            <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 500, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#111', color: '#FFF', fontSize: '11px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                1
              </span>
              <span>Client Contact</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Elena Rostova"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="input-editorial"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Email for Confirmation *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="client@domain.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-editorial"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Phone (+91) for White-Glove Dispatch *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98200 11011"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="input-editorial"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Indian Delivery Address */}
          <div style={{ marginBottom: '40px' }}>
            <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 500, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#111', color: '#FFF', fontSize: '11px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                2
              </span>
              <span>Delivery Address</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Street Line 1 (House/Apartment &amp; Building) *
                </label>
                <input
                  type="text"
                  name="streetLine1"
                  placeholder="42 Altamount Road, Cumballa Hill"
                  value={formData.streetLine1}
                  onChange={handleInputChange}
                  required
                  className="input-editorial"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Street Line 2 (Area/Landmark)
                </label>
                <input
                  type="text"
                  name="streetLine2"
                  placeholder="Penthouse B, Near Hanging Gardens"
                  value={formData.streetLine2}
                  onChange={handleInputChange}
                  className="input-editorial"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="input-editorial"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input-editorial"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    6-Digit Pincode *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="400026"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    maxLength={6}
                    required
                    className="input-editorial"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Indian Payment Matrix */}
          <div style={{ marginBottom: '40px' }}>
            <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 500, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#111', color: '#FFF', fontSize: '11px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                3
              </span>
              <span>Payment Method</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* UPI Option */}
              <div
                onClick={() => setPaymentMethod('UPI')}
                style={{
                  border: '1px solid',
                  borderColor: paymentMethod === 'UPI' ? 'var(--text-primary)' : 'var(--border-light)',
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="radio" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
                    <QrCode size={18} color="var(--accent-gold-dark)" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>UPI (Google Pay, PhonePe, Paytm, QR)</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Instant zero-fee transfer</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--status-success)', letterSpacing: '0.1em' }}>RECOMMENDED</span>
                </div>

                {paymentMethod === 'UPI' && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                    <input
                      type="text"
                      placeholder="Enter UPI VPA ID (e.g. yourname@oksbi)"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      className="input-editorial"
                      style={{ height: '42px', fontSize: '12px' }}
                    />
                  </div>
                )}
              </div>

              {/* Cards Option */}
              <div
                onClick={() => setPaymentMethod('CARD')}
                style={{
                  border: '1px solid',
                  borderColor: paymentMethod === 'CARD' ? 'var(--text-primary)' : 'var(--border-light)',
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="radio" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} />
                  <CreditCard size={18} color="var(--accent-gold-dark)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Credit / Debit Cards</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>RuPay, Visa, MasterCard, American Express</div>
                  </div>
                </div>
              </div>

              {/* NetBanking Option */}
              <div
                onClick={() => setPaymentMethod('NETBANKING')}
                style={{
                  border: '1px solid',
                  borderColor: paymentMethod === 'NETBANKING' ? 'var(--text-primary)' : 'var(--border-light)',
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="radio" checked={paymentMethod === 'NETBANKING'} onChange={() => setPaymentMethod('NETBANKING')} />
                  <Building size={18} color="var(--accent-gold-dark)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>NetBanking</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>HDFC, ICICI, SBI, Axis &amp; 40+ Indian banks</div>
                  </div>
                </div>
                {paymentMethod === 'NETBANKING' && (
                  <div style={{ marginTop: '12px' }}>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="input-editorial"
                      style={{ height: '42px', fontSize: '12px' }}
                    >
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="AXIS">Axis Bank</option>
                      <option value="KOTAK">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}
              </div>

              {/* COD Option */}
              <div
                onClick={() => setPaymentMethod('COD')}
                style={{
                  border: '1px solid',
                  borderColor: paymentMethod === 'COD' ? 'var(--text-primary)' : 'var(--border-light)',
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <Banknote size={18} color="var(--accent-gold-dark)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Cash on Delivery</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Verified via phone confirmation prior to dispatch</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="btn-luxury-dark"
            style={{ width: '100%', padding: '18px 24px', fontSize: '13px' }}
          >
            <Lock size={15} />
            <span>{isProcessing ? 'Confirming with 11 to 11...' : `Complete Acquisition (${formatCurrency(grandTotal)})`}</span>
          </button>
        </form>

        {/* Right: Order Summary */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)', padding: '32px' }}>
          <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 500, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
            Summary ({items.length} {items.length === 1 ? 'Garment' : 'Garments'})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img
                  src={item.product.primaryImage?.url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600'}
                  alt={item.product.title}
                  style={{ width: '48px', aspectRatio: '3/4', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, fontSize: '12px' }}>
                  <div style={{ fontWeight: 500 }}>{item.product.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                    {item.variant.size} • Qty {item.quantity}
                  </div>
                </div>
                <div className="tabular-nums" style={{ fontSize: '13px', fontWeight: 600 }}>
                  {formatCurrency(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span className="tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-success)' }}>
                <span>Discount ({appliedCoupon})</span>
                <span className="tabular-nums">- {formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Insured Delivery</span>
              <span style={{ color: 'var(--status-success)' }}>Complimentary</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-light)', fontSize: '16px', fontWeight: 600 }}>
              <span>Total Valuation</span>
              <span className="tabular-nums">{formatCurrency(grandTotal)}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Inclusive of all Indian taxes &amp; GST.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
