/**
 * NORTHSTAR COMMERCE - Coupon Dataset & Rules Engine
 */

export const COUPONS = [
  {
    code: 'NORTHSTAR15',
    type: 'percentage',
    value: 15, // 15% off
    minSpend: 0,
    description: '15% off your entire order (Welcome special)',
    expiresAt: '2030-12-31'
  },
  {
    code: 'SAVE50',
    type: 'fixed',
    value: 50, // $50 off
    minSpend: 300,
    description: '$50 off on orders over $300',
    expiresAt: '2030-12-31'
  },
  {
    code: 'VIP20',
    type: 'percentage',
    value: 20, // 20% off
    minSpend: 500,
    description: 'VIP 20% off for purchases of $500 or more',
    expiresAt: '2030-12-31'
  },
  {
    code: 'FREESHIP',
    type: 'shipping',
    value: 0, // Free shipping override
    minSpend: 50,
    description: 'Complimentary Express Worldwide Shipping',
    expiresAt: '2030-12-31'
  },
  {
    code: 'EXPIRED25',
    type: 'percentage',
    value: 25,
    minSpend: 100,
    description: 'Expired seasonal discount code for testing validation',
    expiresAt: '2023-01-01'
  }
];

/**
 * Validate and calculate discount for a given coupon code and cart total
 */
export function evaluateCoupon(codeStr, subtotal) {
  if (!codeStr || typeof codeStr !== 'string') {
    return { valid: false, message: 'Please enter a coupon code.' };
  }

  const normalized = codeStr.trim().toUpperCase();
  const coupon = COUPONS.find(c => c.code === normalized);

  if (!coupon) {
    return { valid: false, message: 'Invalid or unrecognized coupon code.' };
  }

  // Check expiration
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, message: 'This coupon code has expired.' };
  }

  // Check minimum spend
  if (coupon.minSpend && subtotal < coupon.minSpend) {
    return {
      valid: false,
      message: `Minimum order of $${coupon.minSpend} required for this code. (Current: $${subtotal.toFixed(2)})`
    };
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = (subtotal * coupon.value) / 100;
  } else if (coupon.type === 'fixed') {
    discountAmount = Math.min(coupon.value, subtotal);
  } else if (coupon.type === 'shipping') {
    discountAmount = 0; // Handled in shipping fee deduction
  }

  return {
    valid: true,
    coupon,
    discountAmount,
    message: `Promo code ${coupon.code} applied: ${coupon.description}`
  };
}
