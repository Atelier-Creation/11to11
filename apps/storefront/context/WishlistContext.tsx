'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CatalogProduct } from '../services/catalog.service';

interface WishlistContextType {
  wishlist: CatalogProduct[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: CatalogProduct) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  wishlistCount: 0,
  isInWishlist: () => false,
  toggleWishlist: () => {},
  removeFromWishlist: () => {},
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('1111_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const saveWishlist = (items: CatalogProduct[]) => {
    setWishlist(items);
    try {
      localStorage.setItem('1111_wishlist', JSON.stringify(items));
    } catch (e) {
      // Ignore
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: CatalogProduct) => {
    if (isInWishlist(product.id)) {
      saveWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      saveWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    saveWishlist(wishlist.filter((item) => item.id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
