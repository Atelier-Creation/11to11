import { apiClient } from './api-client';

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  price: number;
  title: string;
  slug: string;
  sku: string;
  colorName: string;
  size: string;
  imageUrl: string;
}

export interface CartResponse {
  id: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  couponCode?: string | null;
  freeShippingThreshold: number;
}

export const CartService = {
  async getCart(): Promise<CartResponse> {
    try {
      const res = await apiClient<CartResponse>('/cart');
      if (res && res.id) return res;
    } catch (e) {
      // Fallback
    }

    // Default empty cart response
    return {
      id: 'local-cart',
      items: [],
      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      shippingAmount: 0,
      total: 0,
      freeShippingThreshold: 25000,
    };
  },

  async addItem(variantId: string, quantity: number = 1): Promise<CartResponse> {
    return apiClient<CartResponse>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ variantId, quantity }),
    });
  },

  async updateItemQuantity(itemId: string, quantity: number): Promise<CartResponse> {
    return apiClient<CartResponse>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  },

  async removeItem(itemId: string): Promise<CartResponse> {
    return apiClient<CartResponse>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  async applyCoupon(code: string): Promise<CartResponse> {
    return apiClient<CartResponse>('/cart/coupon', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  async removeCoupon(): Promise<CartResponse> {
    return apiClient<CartResponse>('/cart/coupon', {
      method: 'DELETE',
    });
  },
};
