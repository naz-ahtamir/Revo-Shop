"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { getCartCount, getCartFromStorage } from "@/lib/cart";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/promo", label: "Promo" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => setCartCount(getCartCount(getCartFromStorage()));
    update();
    window.addEventListener("storage", update);
    window.addEventListener("revo-cart-updated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("revo-cart-updated", update);
    };
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-[var(--gray-200)] bg-white/97 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-[var(--orange)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <span className="font-[family-name:var(--font-montserrat)] text-xl font-extrabold uppercase tracking-wide text-[var(--black)]">
              REVO<span className="text-[var(--orange)]">SHOP</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-[var(--orange-pale)] text-[var(--orange)]"
                    : "text-[var(--gray-700)] hover:bg-[var(--orange-pale)] hover:text-[var(--orange)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className={`rounded-lg px-3.5 py-2 text-sm font-medium ${
                  pathname.startsWith("/admin")
                    ? "bg-[var(--orange-pale)] text-[var(--orange)]"
                    : "text-[var(--gray-700)] hover:text-[var(--orange)]"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {session ? (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="max-w-[120px] truncate text-sm text-[var(--black)]">
                  {session.user.name}
                </span>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm font-medium text-[var(--gray-700)] hover:text-[var(--orange)]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/login" className="text-sm font-medium text-[var(--black)] hover:text-[var(--orange)]">
                  Login
                </Link>
                <Link href="/register" className="btn btn-outline btn-sm">
                  Register
                </Link>
              </div>
            )}
            <Link
              href="/cart"
              className="flex items-center gap-1.5 rounded-lg bg-[var(--orange-pale)] px-3.5 py-2 text-sm font-semibold text-[var(--orange-dark)] hover:bg-[var(--orange)] hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Cart
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--orange)] text-[11px] font-bold text-white">
                {cartCount}
              </span>
            </Link>
            <button
              type="button"
              className="flex flex-col gap-1.5 p-2 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span className="block h-0.5 w-5 bg-[var(--black)]" />
              <span className="block h-0.5 w-5 bg-[var(--black)]" />
              <span className="block h-0.5 w-5 bg-[var(--black)]" />
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white p-6 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block border-b border-[var(--gray-100)] py-3.5 text-lg font-semibold text-[var(--black)]"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart" onClick={() => setMobileOpen(false)} className="block py-3.5 text-lg font-semibold">
            Cart ({cartCount})
          </Link>
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" onClick={() => setMobileOpen(false)} className="block py-3.5 text-lg font-semibold">
              Admin
            </Link>
          )}
          {!session && (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-3.5 text-lg font-semibold">
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="block py-3.5 text-lg font-semibold">
                Register
              </Link>
            </>
          )}
          {session && (
            <button type="button" onClick={() => signOut()} className="block py-3.5 text-lg font-semibold">
              Logout
            </button>
          )}
        </div>
      )}
    </>
  );
}
