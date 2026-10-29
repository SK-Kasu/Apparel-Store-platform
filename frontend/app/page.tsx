"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, Send, Sparkles, X } from "lucide-react";
import { MobileNav, Sidebar, type Department } from "@/components/sidebar";
import { ProductHero } from "@/components/product-hero";
import { Recommendations } from "@/components/recommendations";
import { TopBar } from "@/components/top-bar";
import { TrustBanner } from "@/components/trust-banner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const DAYLOG_TENANT_ID =
  process.env.NEXT_PUBLIC_DAYLOG_TENANT_ID ?? "00000000-0000-4000-8000-000000000001";
const HERO_PRODUCT_ID =
  process.env.NEXT_PUBLIC_HERO_PRODUCT_ID ?? "00000000-0000-4000-8000-000000000101";
const HERO_VARIANT_ID =
  process.env.NEXT_PUBLIC_HERO_VARIANT_ID ?? "00000000-0000-4000-8000-000000000201";

const STARTER_PROMPTS = [
  "Help me choose a size for the trench.",
  "What outerwear is in stock?",
  "Find something under $150."
];

function messageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("")
    .trim();
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Outerwear");
  const [department, setDepartment] = useState<Department>("Women");
  const [selectedColor, setSelectedColor] = useState("Beige");
  const [selectedSize, setSelectedSize] = useState("M");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());
  const [bagCount, setBagCount] = useState(0);
  const [isAddingToBag, setIsAddingToBag] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${API_BASE_URL}/api/assistant`,
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            tenantId: DAYLOG_TENANT_ID,
            context: {
              productId: HERO_PRODUCT_ID
            },
            messages: messages
              .filter((message) => message.role === "user" || message.role === "assistant")
              .map(({ id, role, parts }) => ({ id, role, parts }))
          }
        })
      }),
    []
  );

  const { messages, sendMessage, status, error, clearError } = useChat({ transport });
  const isChatBusy = status === "submitted" || status === "streaming";
  const lastMessageRole = messages[messages.length - 1]?.role;
  const showTyping = isChatBusy && (!lastMessageRole || lastMessageRole === "user");

  useEffect(() => {
    if (!chatOpen) {
      return;
    }

    const node = feedRef.current;

    if (node) {
      node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
    }
  }, [chatOpen, messages, status]);

  useEffect(() => {
    if (!chatOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setChatOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chatOpen]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const quickAdd = () => {
    setBagCount((count) => count + 1);
  };

  const handleAddToBag = async () => {
    setIsAddingToBag(true);
    setCheckoutNotice(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tenantId: DAYLOG_TENANT_ID,
          items: [
            {
              productId: HERO_PRODUCT_ID,
              variantId: `${HERO_VARIANT_ID}-${selectedColor.toLowerCase()}-${selectedSize.toLowerCase()}`,
              quantity: 1
            }
          ],
          customerEmail: "guest@daylog.studio",
          successUrl: `${window.location.origin}/?checkout=success`,
          cancelUrl: `${window.location.origin}/?checkout=cancelled`
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Checkout request failed");
      }

      setBagCount((count) => count + 1);

      if (payload?.url) {
        window.location.assign(payload.url);
        return;
      }

      setCheckoutNotice("Added to your bag.");
    } catch {
      setBagCount((count) => count + 1);
      setCheckoutNotice(
        "Item added to your local bag. Secure checkout is temporarily unavailable."
      );
    } finally {
      setIsAddingToBag(false);
    }
  };

  const handleChatSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();

    if (!text || isChatBusy) {
      return;
    }

    setInput("");
    await sendMessage({ text });
  };

  return (
    <div className="min-h-screen bg-ink text-zinc-100">
      <Sidebar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        department={department}
        onSelectDepartment={setDepartment}
      />

      <div className="lg:pl-[280px]">
        <TopBar favoriteCount={favoriteIds.size} bagCount={bagCount} />
        <MobileNav activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

        <main className="mx-auto w-full max-w-[1480px] px-4 pb-10 pt-5 sm:px-6 lg:px-8 xl:px-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-[9px] uppercase tracking-[0.28em] text-zinc-600">
              {department} / {activeCategory} / Trench
            </p>
            <p className="hidden text-[9px] uppercase tracking-[0.28em] text-zinc-600 sm:block">
              Complimentary shipping over $100
            </p>
          </div>

          {checkoutNotice ? (
            <div
              role="status"
              className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-sand/25 bg-sand/[0.06] px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-sand"
            >
              <span>{checkoutNotice}</span>
              <button
                type="button"
                onClick={() => setCheckoutNotice(null)}
                className="text-sand/70 transition hover:text-sand"
                aria-label="Dismiss checkout message"
              >
                <X size={15} />
              </button>
            </div>
          ) : null}

          <ProductHero
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            isFavorite={favoriteIds.has("hero-trench")}
            isAddingToBag={isAddingToBag}
            onSelectColor={setSelectedColor}
            onSelectSize={setSelectedSize}
            onToggleFavorite={() => toggleFavorite("hero-trench")}
            onAddToBag={handleAddToBag}
          />

          <Recommendations
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onAddToBag={quickAdd}
          />

          <TrustBanner />

          <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-6 text-[9px] uppercase tracking-[0.22em] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>Daylog Studio — Modern essentials</p>
            <p>Designed in Copenhagen · Shipped worldwide</p>
          </footer>
        </main>
      </div>

      <div className="pointer-events-none fixed inset-0 z-50">
        {chatOpen ? (
          <button
            type="button"
            aria-label="Close assistant overlay"
            onClick={() => setChatOpen(false)}
            className="pointer-events-auto absolute inset-0 bg-black/55 backdrop-blur-[2px]"
          />
        ) : null}

        <aside
          id="daylog-assistant"
          aria-label="Daylog AI assistant"
          aria-hidden={!chatOpen}
          className={`pointer-events-auto absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-white/[0.08] bg-[#101010] shadow-[-40px_0_100px_-30px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            chatOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sand/30 bg-sand/[0.08] text-sand">
                <Sparkles size={18} strokeWidth={1.6} />
              </div>
              <div>
                <p className="font-serif text-2xl leading-none text-cream">Daylog Concierge</p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-zinc-500">
                  Personal styling · AI
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              aria-label="Close assistant"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-zinc-400 transition hover:border-sand/40 hover:text-sand"
            >
              <X size={17} />
            </button>
          </div>

          <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3 text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isChatBusy ? "animate-pulse bg-sand" : "bg-emerald-400"
              }`}
            />
            {isChatBusy ? "Curating your answer" : "Online now"}
          </div>

          <div
            ref={feedRef}
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto px-5 py-6 no-scrollbar"
          >
            {messages.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="font-serif text-2xl leading-tight text-cream">
                  A quieter way to shop.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  Ask about fit, fabric, availability, or a look for the season. I&apos;ll pull
                  from the current Daylog collection.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setInput(prompt)}
                      className="rounded-xl border border-white/[0.08] px-3.5 py-3 text-left text-xs text-zinc-400 transition hover:border-sand/40 hover:bg-sand/[0.04] hover:text-cream"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((message) => {
              const isUser = message.role === "user";
              const text = messageText(message);

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "rounded-br-md bg-sand text-ink"
                        : "rounded-bl-md border border-white/[0.08] bg-white/[0.04] text-zinc-200"
                    }`}
                  >
                    {text ? (
                      <p className="whitespace-pre-wrap">{text}</p>
                    ) : (
                      <p className="italic text-zinc-500">Thinking...</p>
                    )}
                  </div>
                </div>
              );
            })}

            {showTyping ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.04] px-4 py-4">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sand [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sand [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sand" />
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4 text-xs text-red-200">
                <p>{error.message || "The assistant is unavailable right now."}</p>
                <button
                  type="button"
                  onClick={clearError}
                  className="mt-3 text-[9px] uppercase tracking-[0.18em] text-red-200/70 transition hover:text-red-100"
                >
                  Dismiss
                </button>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleChatSubmit} className="border-t border-white/[0.07] p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-white/[0.09] bg-white/[0.03] p-2 transition focus-within:border-sand/50">
              <label htmlFor="assistant-message" className="sr-only">
                Ask the Daylog assistant
              </label>
              <input
                id="assistant-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about fit, fabric, or availability..."
                disabled={isChatBusy}
                className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isChatBusy}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sand text-ink transition hover:bg-[#E0B68E] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isChatBusy ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Send size={17} strokeWidth={1.8} />
                )}
              </button>
            </div>
            <p className="mt-2 text-center text-[8px] uppercase tracking-[0.2em] text-zinc-600">
              AI styling advice · Availability may change
            </p>
          </form>
        </aside>
      </div>

      <button
        type="button"
        onClick={() => setChatOpen(true)}
        aria-expanded={chatOpen}
        aria-controls="daylog-assistant"
        className={`fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2.5 rounded-full border border-sand/30 bg-[#171513]/95 px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream shadow-[0_18px_50px_-15px_rgba(0,0,0,0.9)] backdrop-blur-xl transition duration-300 hover:border-sand/60 hover:text-sand ${
          chatOpen ? "pointer-events-none translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <Sparkles size={17} className="text-sand" strokeWidth={1.6} />
        Ask Daylog
      </button>
    </div>
  );
}
