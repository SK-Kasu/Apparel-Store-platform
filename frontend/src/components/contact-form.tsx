"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  subject: "General enquiry",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [reference, setReference] = useState("");

  const update = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        const message =
          payload && typeof payload === "object" && "error" in payload
            ? String((payload as { error: unknown }).error)
            : "We could not send your message. Please try again.";
        throw new Error(message);
      }

      const data = payload as { message?: string; reference?: string };
      setFeedback(
        data.message ??
          "Asante sana. Your message has reached our Nairobi client care team."
      );
      setReference(data.reference ?? "");
      setStatus("success");
      setForm(INITIAL);
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "We could not send your message. Please try again."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6 sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
          <CheckCircle2 size={24} />
        </span>
        <h2 className="mt-5 font-serif text-3xl text-cream">Message sent</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">{feedback}</p>
        {reference ? (
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Reference <span className="ml-2 font-mono text-sand">{reference}</span>
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setFeedback("");
            setReference("");
          }}
          className="mt-6 flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 transition hover:border-sand/50 hover:text-sand"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-white/[0.07] bg-panel p-5 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Full name
          </span>
          <input
            required
            value={form.name}
            onChange={update("name")}
            autoComplete="name"
            placeholder="Amina Wanjiku"
            className="mt-2 h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 text-sm text-cream outline-none transition placeholder:text-zinc-600 focus:border-sand/50"
          />
        </label>
        <label className="block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Email address
          </span>
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 text-sm text-cream outline-none transition placeholder:text-zinc-600 focus:border-sand/50"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Subject
        </span>
        <select
          value={form.subject}
          onChange={update("subject")}
          className="mt-2 h-12 w-full rounded-xl border border-white/[0.09] bg-[#1a1a1a] px-4 text-sm text-cream outline-none transition focus:border-sand/50"
        >
          <option>General enquiry</option>
          <option>Order support</option>
          <option>Returns & exchanges</option>
          <option>Sizing advice</option>
          <option>Data protection request</option>
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Message
        </span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          placeholder="Tell us how we can help..."
          className="mt-2 w-full resize-y rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-cream outline-none transition placeholder:text-zinc-600 focus:border-sand/50"
        />
      </label>

      {status === "error" ? (
        <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300">
          {feedback}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-sand px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-[#E0B68E] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Sending
          </>
        ) : (
          <>
            Send message
            <Send size={14} />
          </>
        )}
      </button>
      <p className="mt-3 text-[10px] leading-relaxed text-zinc-600">
        By sending this form you consent to Radiant Regalia Collection processing your details
        under the Kenya Data Protection Act, 2019. We never sell your data.
      </p>
    </form>
  );
}
