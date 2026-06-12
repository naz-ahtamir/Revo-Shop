import type { CartItem } from "./types";

export const CART_STORAGE_KEY = "revo_cart";

export function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    
    const cart = JSON.parse(raw) as CartItem[];
    
    // Validate and fix cart items to ensure category is a string
    const validatedCart = cart.filter(item => {
      // If category is an object, try to extract the name, otherwise remove the item
      if (typeof item.category === 'object' && item.category !== null) {
        // Try to fix it if it has a name property
        if ('name' in item.category) {
          item.category = (item.category as { name: string }).name;
          return true;
        }
        // Remove corrupted items
        return false;
      }
      // Keep valid items where category is already a string
      return typeof item.category === 'string';
    });
    
    // If we had to clean up the cart, save the cleaned version
    if (validatedCart.length !== cart.length) {
      saveCartToStorage(validatedCart);
    }
    
    return validatedCart;
  } catch {
    // Clear corrupted localStorage
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

export function saveCartToStorage(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((s, i) => s + i.qty, 0);
}

export function clearCartStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
}
