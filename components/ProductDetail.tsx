"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import type { ApiProduct } from "@/lib/types";
import { fmtUsd } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { addToCartClient } from "@/components/cart-actions";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductDetailProps {
  product: ApiProduct;
  related: ApiProduct[];
}

export function ProductDetail({ product, related }: ProductDetailProps) {
  const [qty, setQty] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex] || "";

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStart === null || touchEnd === null) return;
    
    const distance = touchStart - touchEnd;
    const isSwipeLeft = distance > 50; // Swipe left by 50px
    const isSwipeRight = distance < -50; // Swipe right by 50px

    if (isSwipeLeft) {
      goToNextImage();
    }
    if (isSwipeRight) {
      goToPreviousImage();
    }
  };

  return (
    <div className="container-page py-10">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          {/* Main Image with Swipe Support */}
          <div
            ref={imageContainerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] cursor-grab active:cursor-grabbing"
          >
            {currentImage && (
              <Image
                src={currentImage}
                alt={product.title}
                fill
                className="object-contain p-8 transition-opacity duration-300"
                priority
                key={currentImageIndex}
              />
            )}

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={goToPreviousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white transition-all hover:scale-110 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 text-black" />
                </button>
                <button
                  type="button"
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white transition-all hover:scale-110 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 text-black" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>                
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {hasMultipleImages && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {images.slice(0, 6).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleThumbnailClick(i)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                    i === currentImageIndex
                      ? "border-[var(--orange)] ring-2 ring-[var(--orange)]/30"
                      : "border-[var(--gray-200)] hover:border-[var(--orange)]"
                  }`}
                  title={`Image ${i + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </button>
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