"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { CartItem } from "@/lib/types";
import { fmtUsd } from "@/lib/format";
import { getCartFromStorage, saveCartToStorage } from "@/lib/cart";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    setCart(getCartFromStorage());
    setMounted(true);
  }, [status, router]);

  if (status === "loading" || !mounted) {
    return (
      <div className="container-page py-20 text-center">Loading...</div>
    );
  }

  if (!session) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="container-page py-20">
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white py-16 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-lg font-bold text-[var(--black)]">Your cart is empty</p>
          <Link href="/products" className="btn btn-primary mt-6 inline-flex">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 50 ? 0 : 5; // Free shipping over $50, $5 shipping cost
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customerId: session.user?.id || "",
        items: cart,
        shippingAddress: formData,
        subtotal,
        shipping,
        tax,
        total,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Order failed");
        setLoading(false);
        return;
      }

      const order = await response.json();
      toast.success("Order placed successfully!");
      
      // Clear cart
      saveCartToStorage([]);
      window.dispatchEvent(new Event("revo-cart-updated"));

      // Redirect to order confirmation
      router.push(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast.error("Error placing order");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="display-md mb-8 text-[var(--black)]">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Information */}
            <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-[var(--black)]">
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--black)]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--black)]">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--black)]">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--black)]">
                    Address
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--black)]">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--black)]">
                      Province
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.province}
                      onChange={(e) =>
                        setFormData({ ...formData, province: e.target.value })
                      }
                      className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--black)]">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData({ ...formData, postalCode: e.target.value })
                      }
                      className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-[var(--black)]">Order Items</h2>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b border-[var(--gray-100)] pb-3"
                  >
                    <div>
                      <div className="font-semibold text-[var(--black)]">{item.name}</div>
                      <div className="text-xs text-[var(--gray-600)]">
                        Qty: {item.qty} × {fmtUsd(item.price)}
                      </div>
                    </div>
                    <div className="font-semibold text-[var(--black)]">
                      {fmtUsd(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full justify-center"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 h-fit">
          <h2 className="mb-4 font-bold text-[var(--black)]">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[var(--black)]">
              <span>Subtotal</span>
              <span>{fmtUsd(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--black)]">
              <span>Tax (10%)</span>
              <span>{fmtUsd(tax)}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--black)]">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-[#2d7d2d] font-semibold" : ""}>
                {shipping === 0 ? "FREE" : fmtUsd(shipping)}
              </span>
            </div>
            <div className="border-t border-[var(--gray-200)] pt-2">
              <div className="flex justify-between font-bold text-[var(--black)]">
                <span>Total</span>
                <span className="text-[var(--orange)]">{fmtUsd(total)}</span>
              </div>
            </div>
          </div>
          <Link
            href="/cart"
            className="mt-6 block text-center text-sm text-[var(--orange)] hover:underline"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
