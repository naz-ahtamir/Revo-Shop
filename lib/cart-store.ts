import { useSyncExternalStore } from "react";
import type { CartItem } from "@/lib/types";
import { CART_STORAGE_KEY } from "@/lib/cart";

let cachedSnapshot: CartItem[] = [];

// Stable empty array for SSR - must be cached to avoid infinite loop
const EMPTY_CART: CartItem[] = [];

function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;

  const stored = localStorage.getItem(CART_STORAGE_KEY);
  let newData: CartItem[] = [];
  if (stored) {
    try {
      newData = JSON.parse(stored);
    } catch {
      newData = [];
    }
  }

  if (JSON.stringify(newData) !== JSON.stringify(cachedSnapshot)) {
    cachedSnapshot = newData;
  }

  return cachedSnapshot;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handleStorage = () => {
    getCartSnapshot();
    callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener("revo-cart-updated", handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("revo-cart-updated", handleStorage);
  };
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getCartSnapshot, getServerSnapshot);
}