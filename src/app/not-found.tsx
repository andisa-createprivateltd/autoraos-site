import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-motion flex min-h-[50vh] items-center justify-center">
      <div className="surface-card max-w-2xl p-8 text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-steel">404</p>
        <h1 className="section-heading mt-3 text-3xl font-semibold text-coal md:text-4xl">Page not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-steel">
          The page you requested is unavailable or has moved inside the current AUTORA OS site structure.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="inline-flex items-center justify-center rounded-full bg-coal px-5 py-3 text-sm font-semibold text-white hover:bg-black">
            Back to Home
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-coal/20 px-5 py-3 text-sm font-semibold text-coal hover:bg-coal hover:text-white">
            Contact Team
          </Link>
        </div>
      </div>
    </div>
  );
}
