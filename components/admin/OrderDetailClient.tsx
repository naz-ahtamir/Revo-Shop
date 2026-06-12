"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fmtUsd } from "@/lib/format";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

interface Order {
  id: string;
  customer: string;
  product: string;
  qty: number;
  total: number;
  status: OrderStatus;
  date: string;
}

interface OrderDetailClientProps {
  orderId: string;
}

export function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  async function fetchOrder() {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      const data = await res.json();
      setOrder(data);
    } catch (error) {
      toast.error("Failed to load order");
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(newStatus: OrderStatus) {
    if (!order) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      const updatedOrder = await res.json();
      setOrder(updatedOrder);
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update order");
    } finally {
      setUpdating(false);
    }
  }

  async function handleCancelOrder() {
    if (!order) return;
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to cancel order");
      }

      toast.success("Order cancelled");
      router.push("/admin/orders");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel order");
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="text-[var(--gray-500)]">Order not found</p>
        <Link href="/admin/orders" className="btn btn-primary mt-4">
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-[var(--gray-500)] hover:text-[var(--orange)]"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-[var(--black)]">
            Order #{order.id}
          </h1>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
            statusColors[order.status]
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Order Details */}
      <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-[var(--black)]">
          Order Information
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-[var(--gray-500)]">Customer</p>
            <p className="font-medium text-[var(--black)]">{order.customer}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--gray-500)]">Order Date</p>
            <p className="font-medium text-[var(--black)]">
              {new Date(order.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--gray-500)]">Product</p>
            <p className="font-medium text-[var(--black)]">{order.product}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--gray-500)]">Quantity</p>
            <p className="font-medium text-[var(--black)]">{order.qty}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--gray-500)]">Total Amount</p>
            <p className="text-lg font-bold text-[var(--orange)]">
              {fmtUsd(order.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Status Management */}
      <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-[var(--black)]">
          Status Management
        </h2>
        <div className="flex flex-wrap gap-2">
          {(["Pending", "Processing", "Shipped", "Delivered"] as OrderStatus[]).map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusUpdate(status)}
                disabled={updating || order.status === status}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  order.status === status
                    ? "bg-[var(--orange)] text-white"
                    : "border border-[var(--gray-200)] text-[var(--black)] hover:border-[var(--orange)] hover:text-[var(--orange)]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Cancel Order */}
      {(order.status === "Pending" || order.status === "Processing") && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-lg font-bold text-red-900">Danger Zone</h2>
          <p className="mb-4 text-sm text-red-700">
            Cancelling this order will permanently remove it from the system.
          </p>
          <button
            type="button"
            onClick={handleCancelOrder}
            disabled={updating}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}
