import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/data";
import { categories, testimonials } from "@/lib/constants";
import { Trophy, Truck, DollarSign, Handshake, LucideIcon, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allProducts = await fetchProducts();
  const featured = allProducts.length > 0 ? allProducts.slice(0, 6) : [];
  const heroPreview = allProducts.length > 0 ? allProducts.slice(0, 4) : [];

  const features: [LucideIcon, string, string][] = [
    [Trophy, "Quality Assured", "All sellers verified and products authenticated."],
    [Truck, "Fast Delivery", "Same-day dispatch for orders before 2PM nationwide."],
    [DollarSign, "Best Prices", "Competitive pricing from trusted sellers nationwide."],
    [Handshake, "Trusted Platform", "Preferred marketplace for thousands of shoppers."],
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-white">
        <div className="container-page">
          <div className="grid min-h-[88vh] items-center gap-0 lg:grid-cols-[1fr_1fr]">
            {/* Left — typography dominant */}
            <div className="py-20 pr-0 lg:pr-16">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[4px] text-[#8141E6]">
                Indonesia&apos;s Online Marketplace
              </p>
              <h1
                className="font-[family-name:var(--font-display)] text-[clamp(56px,8vw,104px)] leading-[0.92] tracking-tight text-black"
              >
                Shop
                <br />
                <em className="not-italic text-[#8141E6]">Everything</em>
                <br />
                You Need.
              </h1>
              <p className="mt-8 max-w-sm text-base leading-relaxed text-neutral-500">
                Millions of products from verified sellers across Indonesia. Electronics, fashion, home & living — all in one place.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-black px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#8141E6]"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 border-b border-black pb-0.5 text-sm font-semibold text-black transition-all hover:border-[#8141E6] hover:text-[#8141E6]"
                >
                  View Catalog
                </Link>
              </div>
              {/* Stats row */}
              <div className="mt-14 flex gap-10 border-t border-neutral-100 pt-8">
                {[["500+", "Products"], ["50K+", "Customers"], ["99.2%", "On-time Delivery"]].map(([num, label]) => (
                  <div key={label}>
                    <div className="font-[family-name:var(--font-display)] text-3xl text-black">{num}</div>
                    <div className="mt-1 text-xs text-neutral-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — product image grid */}
            <div className="hidden lg:grid grid-cols-2 gap-3 py-10 pl-3">
              {heroPreview.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group relative overflow-hidden bg-neutral-50"
                  style={{ aspectRatio: i === 0 ? "3/4" : "1/1" }}
                >
                  {p.images?.[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-white/95 p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="truncate text-xs font-semibold text-black">{p.title}</div>
                    <div className="text-xs text-neutral-500">${p.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE STRIP BERJALAN (Tailwind v4) ===== */}
      <div className="overflow-hidden border-y border-neutral-100 bg-[#8141E6] py-3">
        {/* Class animate-marquee sekarang sudah aktif dan otomatis berjalan */}
        <div className="flex w-max gap-12 whitespace-nowrap animate-marquee">
          {Array(3).fill(["Free Shipping Above $50", "New Arrivals Daily", "Verified Sellers Only", "30-Day Returns", "Secure Payment"]).flat().map((text, i) => (
            <span key={i} className="text-xs font-semibold uppercase tracking-[3px] text-white/80">
              {text} <span className="mx-6 text-white/30">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== CATEGORIES ===== */}
      <section className="bg-white py-20">
        <div className="container-page">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-[#8141E6]">Categories</p>
              <h2 className="font-[family-name:var(--font-display)] text-4xl text-black">
                Shop by Category
              </h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-black underline-offset-4 hover:underline">
              All Categories →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-px bg-neutral-100 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/products?category=${encodeURIComponent(c.name)}`}
                className="group flex flex-col items-center bg-white px-4 py-8 text-center transition-colors hover:bg-[#8141E6]"
              >
                <div className="mb-4 flex h-25 w-25 items-center justify-center rounded-full bg-neutral-100 transition-colors group-hover:bg-white/20">
                  <c.Icon className="h-14 w-14 text-[#8141E6] transition-colors group-hover:text-white" />
                </div>
                <div className="text-xs font-semibold text-black transition-colors group-hover:text-white">
                  {c.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="bg-neutral-50 py-20">
        <div className="container-page">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-[#8141E6]">Top Picks</p>
              <h2 className="font-[family-name:var(--font-display)] text-4xl text-black">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-black px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="bg-white py-20">
        <div className="container-page">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-[#8141E6]">Why RevoShop</p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl text-black">
              The Marketplace You Can Trust
            </h2>
          </div>
          <div className="grid gap-px bg-neutral-100 md:grid-cols-2 lg:grid-cols-4">
            {features.map(([Icon, title, desc]) => (
              <div key={title} className="group bg-white p-10 transition-colors hover:bg-[#8141E6] text-center">
                <div className="mb-6 flex h-30 w-30 items-center justify-center rounded-full bg-[#8141E6]/10 transition-colors group-hover:bg-white/20 mx-auto">
                  <Icon className="h-25 w-25 text-[#8141E6] transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-2 text-sm font-bold text-black transition-colors group-hover:text-white">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-500 transition-colors group-hover:text-white/70">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="bg-black py-24">
        <div className="container-page">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-[#8141E6]">
                Limited Time
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(40px,5vw,72px)] leading-[0.95] text-white">
                Up to{" "}
                <span className="text-[#8141E6]">40%</span>
                <br />
                Off Special
                <br />
                Packages
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-neutral-400">
                Bulk purchasing discounts for companies with 50+ employees. Special pricing on complete sets.
              </p>
              <Link
                href="/promo"
                className="mt-8 inline-flex items-center gap-2 bg-[#8141E6] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white hover:text-black"
              >
                View All Promos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["40%", "Bulk Order", "50+ units"],
                ["25%", "Corporate", "Package deal"],
                ["FREE", "Shipping", "Orders > $50"],
                ["12%", "New Member", "First order"],
              ].map(([pct, label, sub]) => (
                <div key={label} className="border border-neutral-800 p-6 transition-all hover:border-[#8141E6]">
                  <div className="font-[family-name:var(--font-display)] text-5xl text-[#8141E6]">{pct}</div>
                  <div className="mt-3 text-sm font-semibold text-white">{label}</div>
                  <div className="mt-0.5 text-xs text-neutral-500">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-neutral-50 py-20">
        <div className="container-page">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-[#8141E6]">Reviews</p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl text-black">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid gap-px bg-neutral-100 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-10">
                <div className="mb-6 font-[family-name:var(--font-display)] text-6xl leading-none text-[#8141E6]">
                  &ldquo;
                </div>
                <p className="mb-8 text-sm leading-relaxed text-neutral-600">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8141E6] text-xs font-bold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-black">{t.name}</div>
                    <div className="text-xs text-neutral-400">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section className="bg-[#8141E6] py-16">
        <div className="container-page text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(36px,5vw,64px)] leading-tight text-white">
            Start Shopping Today
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/70">
            Join 50,000+ satisfied customers across Indonesia.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-semibold text-[#8141E6] transition-all hover:bg-black hover:text-white"
            >
              Browse Products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 border border-white/40 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}