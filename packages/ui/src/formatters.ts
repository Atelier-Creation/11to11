// ==========================================
// 11 11 CURRENCY & FORMATTING UTILITIES
// ==========================================

/**
 * Formats a numeric price into a luxury INR representation (e.g. ₹48,500)
 */
export function formatCurrency(
  amount: number | string | { toString(): string },
  currency: string = 'INR'
): string {
  const numericVal = typeof amount === 'number' ? amount : Number(amount.toString());
  if (isNaN(numericVal)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(numericVal);
}

/**
 * Format date for high-fashion receipts and order timelines
 */
export function formatDate(dateInput: Date | string): string {
  const d = new Date(dateInput);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Generates an editorial SKU code
 */
export function generateSku(prefix: string, color: string, size: string): string {
  const cleanColor = color.slice(0, 3).toUpperCase();
  const cleanSize = size.toUpperCase();
  return `1111-${prefix.toUpperCase()}-${cleanColor}-${cleanSize}`;
}
