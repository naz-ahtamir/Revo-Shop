"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ApiProduct } from "@/lib/types";

interface ProductsListingProps {
  initialProducts?: ApiProduct[];
}

export function ProductsListing({ initialProducts = [] }: ProductsListingProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const initialSearch = searchParams.get("q") ?? "";

  const [products] = useState<ApiProduct[]>(initialProducts);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState("default");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );

  const allCategories = useMemo(
    () => [...new Map(products.map((p) => [p.category.id, p.category])).values()],
    [products]
  );

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategories.length) {
      list = list.filter((p) => selectedCategories.includes(p.category.name));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    const min = parseFloat(priceMin) || 0;
    const max = parseFloat(priceMax) || Infinity;
    if (min > 0) list = list.filter((p) => p.price >= min);
    if (max < Infinity) list = list.filter((p) => p.price <= max);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "newest") list.sort((a, b) => new Date(b.creationAt).getTime() - new Date(a.creationAt).getTime());
    else if (sort === "name") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [products, selectedCategories, search, priceMin, priceMax, sort]);

  const toggleCat = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const hasActiveFilters = selectedCategories.length > 0 || priceMin || priceMax;

  const resetFilters = () => {
    setSelectedCategories([]);
    setSearch("");
    setPriceMin("");
    setPriceMax("");
    setSort("default");
  };

  return (
    <div className="bg-white">
      {/* ===== PAGE HEADER ===== */}
      <div className="border-b border-neutral-100 bg-neutral-50 py-10">
        <div className="container-page">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[3px] text-[#8141E6]">
            Browse
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-black md:text-5xl">
            All Products
          </h1>
        </div>
      </div>

      {/* ===== SEARCH + FILTER BAR ===== */}
      <div className="sticky top-16 z-10 border-b border-neutral-100 bg-white shadow-sm">
        <div className="container-page py-3">
          {/* Search bar — full width */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products, categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 pl-11 pr-4 text-sm text-black outline-none transition-all focus:border-[#8141E6] focus:bg-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter row — semua berjejer */}
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-neutral-400" />

            {/* Category filter pills */}
            {allCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCat(c.name)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategories.includes(c.name)
                    ? "border-[#8141E6] bg-[#8141E6] text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-[#8141E6] hover:text-[#8141E6]"
                }`}
              >
                {c.name}
                <span className="ml-1.5 opacity-60">
                  {products.filter((p) => p.category.id === c.id).length}
                </span>
              </button>
            ))}

            {/* Divider */}
            <div className="h-5 w-px bg-neutral-200" />

            {/* Price range */}
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder="Min $"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-20 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs outline-none focus:border-[#8141E6]"
              />
              <span className="text-xs text-neutral-400">—</span>
              <input
                type="number"
                placeholder="Max $"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-20 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs outline-none focus:border-[#8141E6]"
              />
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-neutral-200" />

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 outline-none focus:border-[#8141E6]"
            >
              <option value="default">Sort: Relevance</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-[#8141E6] hover:underline"
              >
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== RESULTS ===== */}
      <div className="container-page py-8">
        {/* Result count + active filter tags */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-neutral-500">
            <span className="font-semibold text-black">{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""}
          </span>
          {selectedCategories.map((cat) => (
            <span
              key={cat}
              className="flex items-center gap-1 rounded-full bg-[#8141E6]/10 px-3 py-1 text-xs font-semibold text-[#8141E6]"
            >
              {cat}
              <button type="button" onClick={() => toggleCat(cat)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="mb-4 font-[family-name:var(--font-display)] text-6xl text-neutral-200">
              ?
            </div>
            <div className="text-base font-semibold text-black">No products found</div>
            <p className="mt-2 text-sm text-neutral-400">Try adjusting your search or filters</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-lg bg-[#8141E6] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#6b31c4]"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}