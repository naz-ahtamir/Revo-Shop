import Link from "next/link";
import { getOrders } from "@/lib/data";
import { fmtUsd } from "@/lib/format";

export const dynamic = "force-dynamic";

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Delivered: "badge-green",
    Shipped: "badge-orange",
    Processing: "badge-gray",
    Pending: "badge-red",
  };
  return map[status] ?? "badge-gray";
}

export default function AdminOrdersPage() {
  const orders = getOrders();

  return (
    <>
      <h1 className="mb-8 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold uppercase text-[var(--black)]">
        Orders
      </h1>
      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--gray-50)] text-left text-xs uppercase text-[var(--black)]">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-[var(--gray-100)]">
                  <td className="px-4 py-3 font-semibold text-[var(--orange)]">
                    <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--black)]">{o.customer}</td>
                  <td className="px-4 py-3 text-[var(--black)]">{o.product}</td>
                  <td className="px-4 py-3 text-[var(--black)]">{o.qty}</td>
                  <td className="px-4 py-3 text-[var(--black)]">{fmtUsd(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusBadge(o.status)}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--black)]">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
