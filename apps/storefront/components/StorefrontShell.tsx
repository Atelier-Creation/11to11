'use client';

import React from 'react';
import { Header } from './Header';
import { CartDrawer } from './CartDrawer';
import { Footer } from './Footer';
import { LuxuryRouteTransitionProvider } from './motion/LuxuryRouteTransition';
import { useCart } from '../context/CartContext';

export const StorefrontShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    items,
    itemsCount,
    subtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    appliedCoupon,
    isDrawerOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  return (
    <LuxuryRouteTransitionProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header cartCount={itemsCount} onOpenCart={openCart} />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />

        <CartDrawer
          isOpen={isDrawerOpen}
          onClose={closeCart}
          items={items}
          subtotal={subtotal}
          discountAmount={discountAmount}
          shippingFee={shippingFee}
          grandTotal={grandTotal}
          appliedCoupon={appliedCoupon}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onApplyCoupon={applyCoupon}
          onRemoveCoupon={removeCoupon}
        />
      </div>
    </LuxuryRouteTransitionProvider>
  );
};
