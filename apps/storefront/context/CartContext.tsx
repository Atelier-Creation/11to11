'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItemState {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variant: {
    colorName: string;
    size: string;
    sku: string;
  };
  product: {
    title: string;
    slug: string;
    primaryImage?: { url: string; altText?: string };
  };
}

interface CartContextType {
  items: CartItemState[];
  itemsCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  appliedCoupon?: string;
  isDrawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: {
    variantId: string;
    quantity?: number;
    title: string;
    slug: string;
    sku: string;
    colorName: string;
    size: string;
    price: number;
    imageUrl?: string;
  }) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  removeItem: (itemId: string) => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItemState[]>([
    // Default initial luxury item in bag for instant interactive demonstration
    {
      id: 'demo-cart-item-1',
      variantId: '1111-TRN-BLK-M',
      quantity: 1,
      unitPrice: 48500,
      totalPrice: 48500,
      variant: {
        colorName: 'Onyx Black',
        size: 'M',
        sku: '1111-TRN-BLK-M',
      },
      product: {
        title: 'The Sovereign Silk Organza Trench',
        slug: 'sovereign-silk-organza-trench',
        primaryImage: {
          url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
          altText: 'Sovereign Silk Trench',
        },
      },
    },
  ]);

  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>('WELCOME11');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Totals calculation
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);

  // 15% discount if WELCOME11 applied
  let discountAmount = 0;
  if (appliedCoupon === 'WELCOME11') {
    discountAmount = Math.round(subtotal * 0.15);
  } else if (appliedCoupon === '11TO11_5000') {
    discountAmount = Math.min(5000, subtotal);
  }

  const shippingFee = subtotal === 0 || subtotal >= 25000 ? 0 : 1500;
  const grandTotal = Math.max(subtotal - discountAmount + shippingFee, 0);
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const openCart = () => setIsDrawerOpen(true);
  const closeCart = () => setIsDrawerOpen(false);

  const addItem = (item: {
    variantId: string;
    quantity?: number;
    title: string;
    slug: string;
    sku: string;
    colorName: string;
    size: string;
    price: number;
    imageUrl?: string;
  }) => {
    const qty = item.quantity || 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? {
                ...i,
                quantity: i.quantity + qty,
                totalPrice: (i.quantity + qty) * i.unitPrice,
              }
            : i,
        );
      } else {
        return [
          ...prev,
          {
            id: `item-${Date.now()}`,
            variantId: item.variantId,
            quantity: qty,
            unitPrice: item.price,
            totalPrice: item.price * qty,
            variant: {
              colorName: item.colorName,
              size: item.size,
              sku: item.sku,
            },
            product: {
              title: item.title,
              slug: item.slug,
              primaryImage: item.imageUrl ? { url: item.imageUrl } : undefined,
            },
          },
        ];
      }
    });

    setIsDrawerOpen(true);
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, quantity: newQty, totalPrice: newQty * i.unitPrice }
          : i,
      ),
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const applyCoupon = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME11' || clean === '11TO11_5000') {
      setAppliedCoupon(clean);
    } else {
      throw new Error('Promotional voucher is not valid for this curation');
    }
  };

  const removeCoupon = async () => {
    setAppliedCoupon(undefined);
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(undefined);
  };

  return (
    <CartContext.Provider
      value={{
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
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
