import Link from "next/link";

const shopLinks = [
  { href: "/products", label: "All products" },
  { href: "/products?category=1", label: "Electronics" },
  { href: "/products?category=2", label: "Fashion" },
  { href: "/products?category=3", label: "Home & Living" },
  { href: "/products?category=4", label: "Groceries" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-xl font-bold tracking-tight text-ink">
              kade<span className="text-brand-600">.</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
              The local marketplace of Sri Lanka. Discover handpicked products
              from trusted vendors across the island, delivered to your door.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Shop</h3>
            <ul className="mt-3 space-y-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-soft transition hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Account</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/login" className="text-sm text-ink-soft transition hover:text-ink">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-ink-soft transition hover:text-ink">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm text-ink-soft transition hover:text-ink">
                  My orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-ink-soft transition hover:text-ink">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row">
          <p>© {new Date().getFullYear()} Kade Marketplace. All rights reserved.</p>
          <p>Final year project</p>
        </div>
      </div>
    </footer>
  );
}
