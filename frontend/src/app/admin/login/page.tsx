"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles
} from "lucide-react";

type LoginResponse = {
  error?: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@radiantregalia.co.ke");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const payload = (await response.json().catch(() => ({}))) as LoginResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Administrator access denied.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Administrator access denied."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(212,163,115,0.18),transparent_38%),radial-gradient(circle_at_85%_88%,rgba(198,164,126,0.1),transparent_42%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-sand/40 to-transparent" />

      <main className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/[0.08] bg-panel shadow-[0_45px_160px_-40px_rgba(0,0,0,0.95)] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden border-r border-white/[0.07] bg-[#171513] p-10 lg:flex lg:flex-col lg:justify-between xl:p-12">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sand/15 blur-3xl" />
            <div className="absolute -bottom-32 -left-16 h-64 w-64 rounded-full border border-sand/10" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-sand/40 font-serif text-2xl text-sand">
                  R
                </span>
                <div>
                  <p className="font-serif text-[23px] leading-[1.02] tracking-tight text-cream">
                    Radiant Regalia Collection
                  </p>
                  <p className="mt-1.5 text-[8px] uppercase tracking-[0.34em] text-zinc-500">
                    All under one roof
                  </p>
                </div>
              </div>

              <div className="mt-20">
                <p className="text-[9px] uppercase tracking-[0.32em] text-sand">
                  Private atelier access
                </p>
                <h1 className="mt-4 font-serif text-6xl leading-[0.88] tracking-[-0.02em] text-cream xl:text-7xl">
                  The house,
                  <br />
                  <span className="text-sand-soft">behind the seams.</span>
                </h1>
                <p className="mt-6 max-w-sm font-serif text-lg italic leading-relaxed text-zinc-400">
                  A considered workspace for catalog, order, and client operations across
                  the Radiant Regalia Collection.
                </p>
              </div>
            </div>

            <div className="relative mt-16 grid gap-3">
              {[
                { icon: ShieldCheck, label: "Encrypted session access" },
                { icon: Sparkles, label: "Curated administrative workspace" },
                { icon: LockKeyhole, label: "Role-gated controls" }
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-black/15 px-4 py-3"
                >
                  <Icon size={15} className="text-sand" />
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="relative flex flex-col justify-center p-6 sm:p-10 xl:p-12">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-sand/40 font-serif text-lg text-sand">
                R
              </span>
              <div>
                <p className="font-serif text-lg leading-none text-cream">
                  Radiant Regalia Collection
                </p>
                <p className="mt-1 text-[7px] uppercase tracking-[0.3em] text-zinc-500">
                  All under one roof
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.28em] text-sand">
              <LockKeyhole size={14} />
              Administrator portal
            </div>
            <h2 className="mt-4 font-serif text-4xl leading-[0.95] tracking-tight text-cream sm:text-5xl">
              Welcome back
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Enter your credentials to unlock the administrative workspace.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  Email address
                </span>
                <span className="mt-2 flex h-13 items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.025] px-4 transition focus-within:border-sand/50 focus-within:bg-white/[0.04]">
                  <Mail size={16} className="text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    className="h-13 w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
                    placeholder="admin@radiantregalia.co.ke"
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  Password
                </span>
                <span className="mt-2 flex h-13 items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.025] px-4 transition focus-within:border-sand/50 focus-within:bg-white/[0.04]">
                  <LockKeyhole size={16} className="text-zinc-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    className="h-13 w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-zinc-500 transition hover:text-sand"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </span>
              </label>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-[11px] leading-relaxed text-red-200"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-sand px-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink transition hover:bg-[#E0B68E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowRight size={16} />
                )}
                {isSubmitting ? "Verifying access..." : "Enter workspace"}
              </button>
            </form>

            <div className="mt-7 flex items-center gap-2 border-t border-white/[0.06] pt-5 text-[8px] uppercase tracking-[0.2em] text-zinc-600">
              <ShieldCheck size={13} className="text-sand/70" />
              Authorized personnel only · Encrypted session
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
