"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);

    try {
      await fetch("/api/auth", { method: "DELETE" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isLoading}
      className="flex h-10 items-center gap-2 rounded-full border border-white/[0.1] px-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-400 transition hover:border-sand/50 hover:text-sand disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
      {isLoading ? "Closing" : "Sign out"}
    </button>
  );
}
