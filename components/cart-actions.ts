"use client";

import type { ApiProduct } from "@/lib/types";
import { getCartFromStorage, saveCartToStorage } from "@/lib/cart";
import { toast } from "sonner";

export function addToCartClient(product: ApiProduct, qty = 1) {
  const cart = getCartFromStorage();
  const existing = cart.find((x) => x.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.title,
      category: product.category.name, // Extract name from category object
      price: product.price,
      imageUrl: product.images[0] || "https://placehold.co/600x400",
      qty,
    });
  }
  saveCartToStorage(cart);
  window.dispatchEvent(new Event("revo-cart-updated"));
  toast.success(`🛒 ${product.title} added to cart!`);
}

export function dispatchCartUpdate() {
  window.dispatchEvent(new Event("revo-cart-updated"));
}
