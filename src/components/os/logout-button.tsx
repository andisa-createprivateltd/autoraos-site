"use client";

import { useState } from "react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
    } finally {
      window.location.href = "/os/login";
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border border-steel/30 px-4 py-2 text-xs font-semibold text-coal hover:bg-mist disabled:opacity-70"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
