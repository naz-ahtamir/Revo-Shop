"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { CartItem } from "@/lib/types";
import { fmtUsd } from "@/lib/format";
import { getCartFromStorage, saveCartToStorage } from "@/lib/cart";
import { dispatchCartUpdate } from "@/components/cart-actions";
import { useCart } from "@/lib/cart-store";

export function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const cart: CartItem[] = useCart(); // ✅ Tipe ditambahkan
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateQty = (id: number, delta: number) => {
    const current = getCartFromStorage();
    const next = current.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    saveCartToStorage(next);
    dispatchCartUpdate();
  };

  const removeItem = (id: number) => {
    const current = getCartFromStorage();
    const next = current.filter((x) => x.id !== id);
    saveCartToStorage(next);
    dispatchCartUpdate();
  };

  const clearCart = () => {
    saveCartToStorage([]);
    dispatchCartUpdate();
  };

  if (!mounted) {
    return <div className="container-page py-20 text-center text-[var(--black)]">Loading cart...</div>;
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0); // ✅ TypeScript sekarang tahu s: number, i: CartItem
  const shipping = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shipping;

  return (
    <div className="container-page py-10">
      <h1 className="display-md mb-8 text-[var(--black)]">Shopping Cart</h1>
      {session?.user && (
        <p className="mb-6 rounded-lg bg-[var(--orange-pale)] px-4 py-2 text-sm text-[var(--black)]">
          Logged in as <strong>{session.user.name}</strong> ({session.user.email})
        </p>
      )}
      {cart.length === 0 ? (
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white py-16 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-lg font-bold text-[var(--black)]">Your cart is empty</p>
          <p className="mt-2 text-sm text-[var(--black)]">Browse our catalog and add safety equipment</p>
          <Link href="/products" className="btn btn-primary mt-6 inline-flex">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold text-[var(--black)]">Items ({cart.length})</span>
              <button type="button" onClick={clearCart} className="text-sm text-[var(--gray-500)] hover:text-[var(--orange)]">
                Clear all
              </button>
            </div>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--gray-200)] bg-white p-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--gray-50)]">
                    {item.imageUrl && item.imageUrl.trim() !== "" ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-[var(--black)]">{item.name}</div>
                    <div className="text-xs text-[var(--black)]">
                      {typeof item.category === 'string' ? item.category : 'Unknown Category'}
                    </div>
                    <div className="text-[var(--orange)]">{fmtUsd(item.price)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-lg border">
                      <button type="button" onClick={() => updateQty(item.id, -1)} className="px-3 py-1">
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, 1)} className="px-3 py-1">
                        +
                      </button>
                    </div>
                    <span className="min-w-[80px] text-right font-bold text-[var(--black)]">
                      {fmtUsd(item.price * item.qty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[var(--gray-500)] hover:text-red-600"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 h-fit">
            <h2 className="mb-4 font-bold text-[var(--black)]">Order Summary</h2>
            <div className="flex justify-between text-sm text-[var(--black)] mb-2">
              <span>Subtotal</span>
              <span>{fmtUsd(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--black)] mb-2">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-[#2d7d2d]" : ""}>
                {shipping === 0 ? "FREE" : fmtUsd(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-[var(--black)] mb-4">
                Add {fmtUsd(50 - subtotal)} more for free shipping
            </p>
            )}
            {shipping === 0 && (
              <p className="text-xs text-[#2d7d2d] font-semibold mb-4">You qualify for free shipping!</p>
            )}
            <div className="flex justify-between border-t pt-4 font-bold text-[var(--black)]">
              <span>Total</span>
              <span>{fmtUsd(total)}</span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="btn btn-primary mt-6 w-full justify-center"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
