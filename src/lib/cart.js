'use client';

import { useSyncExternalStore } from 'react';

import { MAX_CART_QUANTITY } from '@/data/products';

const storageKey = 'hadassah-cart-v1';
const emptyCart = [];
let cart = emptyCart;
let loaded = false;
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function sanitiseCart(value) {
  if (!Array.isArray(value)) return emptyCart;
  const seen = new Set();
  return value.flatMap((item) => {
    if (
      !item ||
      typeof item.id !== 'string' ||
      seen.has(item.id) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      return [];
    }
    seen.add(item.id);
    return [{ id: item.id, quantity: Math.min(item.quantity, MAX_CART_QUANTITY) }];
  });
}

function readStoredCart() {
  try {
    return sanitiseCart(JSON.parse(window.localStorage.getItem(storageKey) || '[]'));
  } catch {
    return emptyCart;
  }
}

function persist(nextCart) {
  cart = nextCart;
  window.localStorage.setItem(storageKey, JSON.stringify(cart));
  emit();
}

function subscribe(listener) {
  listeners.add(listener);
  if (!loaded) {
    loaded = true;
    cart = readStoredCart();
    queueMicrotask(emit);
  }
  return () => listeners.delete(listener);
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey) {
      cart = readStoredCart();
      emit();
    }
  });
}

export function useCart() {
  return useSyncExternalStore(
    subscribe,
    () => cart,
    () => emptyCart,
  );
}

export function addToCart(id) {
  const existing = cart.find((item) => item.id === id);
  persist(
    existing
      ? cart.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(item.quantity + 1, MAX_CART_QUANTITY) }
            : item,
        )
      : [...cart, { id, quantity: 1 }],
  );
}

export function updateCartQuantity(id, quantity) {
  if (quantity <= 0) {
    persist(cart.filter((item) => item.id !== id));
    return;
  }
  persist(
    cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.min(quantity, MAX_CART_QUANTITY) } : item,
    ),
  );
}

export function clearCart() {
  persist(emptyCart);
}
