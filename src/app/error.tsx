"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-motion flex min-h-[50vh] items-center justify-center">
      <div className="surface-card max-w-2xl p-8 text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-steel">Site Error</p>
        <h1 className="section-heading mt-3 text-3xl font-semibold text-coal md:text-4xl">Something interrupted this page</h1>
        <p className="mt-4 text-sm leading-relaxed text-steel">
          Reload the page or retry the action. If the problem persists, contact the AUTORA OS team.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-coal px-5 py-3 text-sm font-semibold text-white hover:bg-black"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
