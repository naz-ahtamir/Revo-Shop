"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";

interface Category {
  id: number;
  name: string;
}

const fetcher = (url: string) => 
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .catch((error) => {
      console.error("Fetcher error:", error);
      throw error;
    });

export function Footer() {
  const pathname = usePathname();
  
  const { data: categories, error } = useSWR<Category[]>("/api/categories", fetcher, {
    revalidateOnFocus: false,
    fallbackData: [
      { id: 1, name: "Electronics" },
      { id: 2, name: "Clothes" },
      { id: 3, name: "Furniture" },
      { id: 4, name: "Shoes" }
    ] as Category[]
  });

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-[var(--gray-200)] bg-[var(--orange-pale)]">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-[var(--orange)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <span className="font-[family-name:var(--font-montserrat)] text-lg font-extrabold uppercase">
                REVO<span className="text-[var(--orange)]">SHOP</span>
              </span>
            </div>
            <p className="text-sm text-[var(--black)]">
              Your trusted global marketplace for authentic products across every category—delivering speed, unbeatable value, and guaranteed originality.
            </p>
          </div>
          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--black)]">Quick Links</div>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-[var(--black)] hover:text-[var(--orange)]">Home</Link>
              <Link href="/products" className="text-sm text-[var(--black)] hover:text-[var(--orange)]">All Products</Link>
              <Link href="/promo" className="text-sm text-[var(--black)] hover:text-[var(--orange)]">Promotions</Link>
              <Link href="/faq" className="text-sm text-[var(--black)] hover:text-[var(--orange)]">FAQ</Link>
            </div>
          </div>
          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--black)]">Categories</div>
            <div className="flex flex-col gap-2">
              {categories
                ?.filter((c) => c.name.length >= 2)
                .slice(0, 4)
                .map((c) => (
                  <Link
                    key={c.id}
                    href={`/products?category=${encodeURIComponent(c.name)}`}
                    className="text-sm text-[var(--black)] hover:text-[var(--orange)]"
                  >
                    {c.name}
                  </Link>
                ))}
            </div>
          </div>
          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--black)]">Contact</div>
            <div className="space-y-2 text-sm text-[var(--black)]">
              <p>Jl. Veteran Selatan No. 88, Mandala, Mamajang, Kota Makassar, Sulawesi Selatan 90114, Indonesia.</p>               
              <p>0822-2071-5073</p>
              <p>Mon-Fri : 9:00 – 18:00 WITA</p>
              <a href="https://www.naz-ahtamir.site/"><p className="font-bold">www.naz-ahtamir.site</p></a>              
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--orange)]/20">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
          <p className="text-xs text-[var(--black)]">© 2026 RevoShop. <a href="https://www.naz-ahtamir.site/"
            ><span className="text-[var(--orange)] font-bold">naz-ahtamir</span></a></p>
          <div className="flex gap-2">
            {["Secure", "Global"].map((c) => (
              <span key={c} className="badge badge-orange text-[10px]">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}