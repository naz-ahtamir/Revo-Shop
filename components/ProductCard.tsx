"use client";

import Image from "next/image";
import Link from "next/link";
import type { ApiProduct } from "@/lib/types";
import { fmtUsd } from "@/lib/format";
import { addToCartClient } from "@/components/cart-actions";

interface ProductCardProps {
  product: ApiProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] || "";

  return (
    <div className="group rounded-2xl border border-[var(--gray-200)] bg-white p-5 transition-all hover:border-[var(--orange)] hover:shadow-lg">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--gray-50)]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-[var(--gray-300)]">
              📦
            </div>
          )}
        </div>
        <div className="mt-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--orange)]">
            {product.category.name}
          </span>
          <h3 className="mt-1.5 line-clamp-2 font-semibold text-[var(--black)]">
            {product.title}
          </h3>
          <div className="mt-4 flex items-center justify-between">
            <div className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-[var(--black)]">
              {fmtUsd(product.price)}
            </div>
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => addToCartClient(product, 1)}
        className="btn btn-primary btn-sm mt-4 w-full"
      >
        Add to Cart
      </button>
    </div>
  );
}