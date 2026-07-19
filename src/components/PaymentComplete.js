'use client';

import { useEffect } from 'react';

import { clearCart } from '@/lib/cart';

export function PaymentComplete() {
  useEffect(() => clearCart(), []);
  return null;
}
