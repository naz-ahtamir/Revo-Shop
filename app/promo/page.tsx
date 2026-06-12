import Link from "next/link";

const deals = [
  {
    pct: "40%",
    label: "Flash Sale – Helmets",
    desc: "All safety helmets 40% off this weekend. Limited stock available.",
    products: ["Safety Helmet", "Hard Hat", "MSA Helmet"],
    expires: "June 30, 2027",
  },
  {
    pct: "25%",
    label: "Corporate Bundle",
    desc: "Complete PPE sets for 20+ employees.",
    products: ["Set Lengkap APD"],
    expires: "December 31, 2027",
  },
  {
    pct: "FREE",
    label: "Shipping on Rp500K+",
    desc: "Free nationwide shipping for orders above Rp 500,000.",
    products: ["All products"],
    expires: "Ongoing",
  },
  {
    pct: "12%",
    label: "New Member Welcome",
    desc: "First order discount for new registered members.",
    products: ["All products"],
    expires: "First order only",
  },
];

export default function PromoPage() {
  return (
    <div className="container-page py-10">
      <div className="mb-10">
        <p className="subheading">Deals & Offers</p>
        <h1 className="display-md mt-2 text-[var(--black)]">Promotions</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((d) => (
          <div
            key={d.label}
            className="relative overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white p-6"
          >
            <div className="absolute top-0 left-0 h-1 w-full bg-[var(--orange)]" />
            <div className="font-[family-name:var(--font-montserrat)] text-4xl font-extrabold text-[var(--orange)]">
              {d.pct}
            </div>
            <h3 className="mt-2 font-bold text-[var(--black)]">{d.label}</h3>
            <p className="mt-2 text-sm text-[var(--black)]">{d.desc}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {d.products.map((p) => (
                <span key={p} className="badge badge-gray">
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--black)]">Valid until: {d.expires}</p>
            <Link href="/products" className="btn btn-outline btn-sm mt-4 inline-flex">
              Shop Now →
            </Link>
          </div>
        ))}
      </div>
      <section className="mt-16">
        <h2 className="display-md mb-8 text-[var(--black)]">Bulk Discounts</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { min: 10, disc: "5%", featured: false },
            { min: 25, disc: "12%", featured: true },
            { min: 50, disc: "20%", featured: false },
            { min: 100, disc: "30%", featured: false },
          ].map((b) => (
            <div
              key={b.min}
              className={`rounded-2xl border p-6 text-center ${
                b.featured ? "border-[var(--orange)] bg-[var(--orange-pale)]" : "border-[var(--gray-200)] bg-white"
              }`}
            >
              {b.featured && <span className="badge badge-orange mb-2">Most Popular</span>}
              <div className="text-sm text-[var(--black)]">Min.</div>
              <div className="font-[family-name:var(--font-montserrat)] text-4xl font-extrabold text-[var(--orange)]">
                {b.min}
              </div>
              <div className="text-sm text-[var(--black)]">units</div>
              <div className="mt-2 text-2xl font-bold text-[var(--black)]">{b.disc}</div>
              <div className="text-sm text-[var(--black)]">discount</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
