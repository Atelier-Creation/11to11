// ==========================================
// 11 11 LUXURY E-COMMERCE SHARED TYPES & ENUMS
// ==========================================

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MERCHANDISER = 'MERCHANDISER',
  FULFILLMENT = 'FULFILLMENT'
}

export enum Gender {
  WOMEN = 'WOMEN',
  MEN = 'MEN',
  UNISEX = 'UNISEX'
}

export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  FULFILLED = 'FULFILLED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentGateway {
  RAZORPAY = 'RAZORPAY',
  CASHFREE = 'CASHFREE',
  MANUAL_TEST = 'MANUAL_TEST'
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING'
}

// ------------------------------------------
// User & Address Models
// ------------------------------------------

export interface AddressDto {
  id?: string;
  fullName: string;
  phone: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
  addresses?: AddressDto[];
}

// ------------------------------------------
// Catalog Models
// ------------------------------------------

export interface ProductImageDto {
  id: string;
  url: string;
  storageKey: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
  colorName?: string;
}

export interface ProductVariantDto {
  id: string;
  sku: string;
  colorName: string;
  colorHex: string;
  size: string;
  price: number;
  compareAtPrice?: number;
  barcode?: string;
  weightGrams?: number;
  availableQuantity?: number;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  gender?: Gender;
}

export interface CollectionDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  season?: string;
  year?: number;
  isActive: boolean;
}

export interface ProductDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  details?: string;
  material?: string;
  careInstructions?: string;
  gender: Gender;
  isActive: boolean;
  isFeatured: boolean;
  category: CategoryDto;
  collection?: CollectionDto;
  images: ProductImageDto[];
  variants: ProductVariantDto[];
  createdAt: Date;
  updatedAt: Date;
}

// ------------------------------------------
// Inventory Models
// ------------------------------------------

export interface InventoryItemDto {
  id: string;
  variantId: string;
  warehouseId: string;
  quantityOnHand: number;
  reservedQuantity: number;
  availableQuantity: number;
}

export interface StockReservationRequest {
  variantId: string;
  quantity: number;
  cartId: string;
}

// ------------------------------------------
// Cart Models
// ------------------------------------------

export interface CartItemDto {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variant: ProductVariantDto;
  product: {
    id: string;
    title: string;
    slug: string;
    primaryImage?: ProductImageDto;
  };
}

export interface CartDto {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItemDto[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  grandTotal: number;
  appliedCoupon?: string;
}

// ------------------------------------------
// Orders & Checkout Models
// ------------------------------------------

export interface CreateOrderDto {
  cartId: string;
  shippingAddress: AddressDto;
  billingAddress?: AddressDto;
  paymentGateway: PaymentGateway;
  customerNote?: string;
}

export interface OrderItemDto {
  id: string;
  variantId: string;
  title: string;
  sku: string;
  colorName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerPhone: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;
  currency: string;
  items: OrderItemDto[];
  shippingAddress: AddressDto;
  payment?: {
    id: string;
    gateway: PaymentGateway;
    status: PaymentStatus;
    transactionId?: string;
  };
  trackingCode?: string;
  courierName?: string;
  createdAt: Date;
}

// ------------------------------------------
// Search & Filter Models
// ------------------------------------------

export interface SearchQueryDto {
  q?: string;
  categorySlug?: string;
  collectionSlug?: string;
  gender?: Gender;
  colors?: string[];
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'relevance';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ------------------------------------------
// BullMQ Async Queue Jobs
// ------------------------------------------

export const QUEUE_NAMES = {
  EMAIL: 'email_queue',
  INVOICE: 'invoice_queue',
  INVENTORY: 'inventory_queue',
  CATALOG: 'catalog_queue',
  NOTIFICATIONS: 'notifications_queue'
} as const;

export interface OrderCreatedJobPayload {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  totalAmount: number;
  itemsCount: number;
}

export interface InvoiceGenerateJobPayload {
  orderId: string;
  orderNumber: string;
}

export interface InventoryCleanupJobPayload {
  triggerSource: 'scheduler' | 'manual';
}
