"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ApiProduct } from "@/lib/types";
import { fmtUsd } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { addToCartClient } from "@/components/cart-actions";

interface ProductDetailProps {
  product: ApiProduct;
  related: ApiProduct[];
}

export function ProductDetail({ product, related }: ProductDetailProps) {
  const [qty, setQty] = useState(1);
  const imageUrl = product.images?.[0] || "";

  return (
    <div className="container-page py-10">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)]">
            {imageUrl && (
              <Image src={imageUrl} alt={product.title} fill className="object-contain p-8" priority />
            )}
          </div>
          {/* Thumbnail gallery */}
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.slice(0, 4).map((img, i) => (
                <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-[var(--gray-200)] bg-[var(--gray-50)]">
                  <Image src={img} alt={`${product.title} ${i + 1}`} fill className="object-contain p-1" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="badge badge-orange">{product.category.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--black)]">{product.title}</h1>

          <div className="mt-6">
            <div className="font-[family-name:var(--font-montserrat)] text-4xl font-bold text-[var(--black)]">
              {fmtUsd(product.price)}
            </div>
          </div>

          <p className="mt-6 text-[var(--black)]">{product.description}</p>

          <div className="mt-6 rounded-xl border border-[var(--gray-200)]">
            {[
              ["Category", product.category.name],
              ["Price", fmtUsd(product.price)],
              ["Added", new Date(product.creationAt).toLocaleDateString("en-US")],
              ["Last Updated", new Date(product.updatedAt).toLocaleDateString("en-US")],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-[var(--gray-100)] px-4 py-2.5 text-sm last:border-0">
                <span className="text-[var(--black)]">{k}</span>
                <span className="font-medium text-[var(--black)]">{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-semibold text-[var(--black)]">Quantity:</span>
            <div className="flex items-center rounded-lg border border-[var(--gray-200)]">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-2 text-lg hover:bg-[var(--orange-pale)]"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="px-4 py-2 text-lg hover:bg-[var(--orange-pale)]"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addToCartClient(product, qty)}
              className="btn btn-primary btn-lg"
            >
              Add to Cart
            </button>
            <Link
              href="/cart"
              onClick={() => addToCartClient(product, qty)}
              className="btn btn-secondary btn-lg"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="display-md mb-8 text-[var(--black)]">Related Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}