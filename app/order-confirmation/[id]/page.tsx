import Link from "next/link";
import { Check } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="container-page py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f5e8]">
            <Check className="h-10 w-10 text-[#2d7d2d]" />
          </div>
        </div>

        <h1 className="display-md mb-3 text-[var(--black)]">Order Confirmed!</h1>
        <p className="mb-2 text-sm text-[var(--black)]">
          Thank you for your purchase. Your order has been received and is being prepared for shipment.
        </p>

        <div className="my-8 rounded-2xl border border-[var(--gray-200)] bg-[var(--orange-pale)] p-6">
          <div className="text-xs uppercase tracking-wider text-[var(--gray-600)] mb-1">Order Number</div>
          <div className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-[var(--black)]">
            {id}
          </div>
        </div>

        <p className="mb-6 text-sm text-[var(--gray-600)]">
          A confirmation email has been sent to your registered email address with order details and tracking information.
        </p>

        <div className="space-y-2">
          <Link href="/products" className="btn btn-primary w-full justify-center">
            Continue Shopping
          </Link>
          <Link href="/" className="btn btn-outline w-full justify-center">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
