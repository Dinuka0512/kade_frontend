import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/80 via-black/70 to-brand-400/70" />
      <div className="relative mx-auto flex min-h-[350px] max-w-4xl flex-col items-center justify-center px-4 text-center sm:min-h-[370px] sm:px-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Shop island-wide. Support local vendors.
        </h1>
        <Link
          href="/products"
          className="mt-8 rounded-md bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Start shopping
        </Link>
      </div>
    </section>
  );
}
