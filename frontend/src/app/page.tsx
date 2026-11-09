"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { MobileNav, Sidebar, type Department } from "@/components/sidebar";
import { ProductHero } from "@/components/product-hero";
import { Recommendations } from "@/components/recommendations";
import { TopBar } from "@/components/top-bar";
import { TrustBanner } from "@/components/trust-banner";

type SupportMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const STARTER_PROMPTS = [
  "Help me choose a size for the trench.",
  "What outerwear is in stock?",
  "Find something under $150."
];

const INITIAL_MESSAGES: SupportMessage[] = [
  {
    id: 1,
    role: "assistant",
    text: "Welcome to Radiant Regalia. Ask about fit, fabric, or availability and I'll help you find the perfect piece."
  }
];

const CHECKOUT_TENANT_ID =
  process.env.NEXT_PUBLIC_CHECKOUT_TENANT_ID ?? "00000000-0000-4000-8000-000000000001";
const CHECKOUT_PRODUCT_ID =
  process.env.NEXT_PUBLIC_CHECKOUT_PRODUCT_ID ?? "00000000-0000-4000-8000-000000000101";
const CHECKOUT_VARIANT_ID =
  process.env.NEXT_PUBLIC_CHECKOUT_VARIANT_ID ?? "00000000-0000-4000-8000-000000000201";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Outerwear");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [department, setDepartment] = useState<Department>("Women");
  const [activeColor, setActiveColor] = useState("Beige");
  const [activeSize, setActiveSize] = useState("M");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());
  const [cartCount, setCartCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<SupportMessage[]>(INITIAL_MESSAGES);

  useEffect(() => {
    if (!isChatOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsChatOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatOpen]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDarkMode);
    root.classList.toggle("light", !isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((current) => !current);

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

  const addToBag = () => {
    setCartCount((prev) => prev + 1);
  };

  const handleCheckout = async () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    const item = {
      tenantId: CHECKOUT_TENANT_ID,
      productId: CHECKOUT_PRODUCT_ID,
      variantId: `${CHECKOUT_VARIANT_ID}-${activeColor.toLowerCase()}-${activeSize.toLowerCase()}`,
      quantity: 1
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...item,
          items: [item]
        })
      });

      if (response.ok || response.status === 200) {
        window.alert(
          "Order successfully secured! Check the Admin Analytics panel to verify live metrics tracking."
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectCategory = (category: string) => {
    setActiveCategory(category);
    setIsSidebarOpen(false);
  };

  const selectDepartment = (nextDepartment: Department) => {
    setDepartment(nextDepartment);
    setIsSidebarOpen(false);
  };

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = chatInput.trim();

    if (!text) {
      return;
    }

    const baseId = Date.now();

    setMessages((current) => [
      ...current,
      { id: baseId, role: "user", text },
      {
        id: baseId + 1,
        role: "assistant",
        text: "Thank you. A Radiant Regalia stylist will follow up shortly. The trench is available in every size shown."
      }
    ]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-ink text-zinc-900 dark:text-zinc-100">
      <Sidebar
        activeCategory={activeCategory}
        onSelectCategory={selectCategory}
        department={department}
        onSelectDepartment={selectDepartment}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="lg:pl-[280px]">
        <TopBar
          favoriteCount={favoriteIds.size}
          bagCount={cartCount}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
        <MobileNav activeCategory={activeCategory} onSelectCategory={selectCategory} />

        <main className="mx-auto w-full max-w-[1480px] px-4 pb-10 pt-5 sm:px-6 lg:px-8 xl:px-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-[9px] uppercase tracking-[0.28em] text-faint">
              {department} / {activeCategory} / Trench
            </p>
            <p className="hidden text-[9px] uppercase tracking-[0.28em] text-faint sm:block">
              Complimentary shipping over $100
            </p>
          </div>

          <ProductHero
            activeColor={activeColor}
            activeSize={activeSize}
            isFavorite={favoriteIds.has("hero-trench")}
            isProcessing={isProcessing}
            onSelectColor={setActiveColor}
            onSelectSize={setActiveSize}
            onToggleFavorite={() => toggleFavorite("hero-trench")}
            onAddToBag={addToBag}
            onBuyNow={handleCheckout}
          />

          <Recommendations
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onAddToBag={addToBag}
          />

          <TrustBanner />

          <footer className="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-[9px] uppercase tracking-[0.22em] text-faint sm:flex-row sm:items-center sm:justify-between">
            <p>Radiant Regalia — Modern essentials</p>
            <p>Designed in Copenhagen · Shipped worldwide</p>
          </footer>
        </main>
      </div>

      <div className="pointer-events-none fixed inset-0 z-50">
        {isChatOpen ? (
          <button
            type="button"
            aria-label="Close support overlay"
            onClick={() => setIsChatOpen(false)}
            className="pointer-events-auto absolute inset-0 bg-black/55 backdrop-blur-[2px]"
          />
        ) : null}

        <aside
          id="radiant-regalia-support"
          aria-label="Radiant Regalia support"
          aria-hidden={!isChatOpen}
          className={`pointer-events-auto absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col border-l border-line bg-white dark:bg-[#101010] shadow-[-40px_0_100px_-30px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isChatOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sand/30 bg-sand/[0.08] text-sand">
                <Sparkles size={18} strokeWidth={1.6} />
              </div>
              <div>
                <p className="font-serif text-2xl leading-none text-cream">
                  Radiant Regalia Concierge
                </p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-subtle">
                  Personal styling · AI
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              aria-label="Close support panel"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition hover:border-sand/40 hover:text-sand"
            >
              <X size={17} />
            </button>
          </div>

          <div className="flex items-center gap-2 border-b border-line px-5 py-3 text-[9px] uppercase tracking-[0.22em] text-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Online now
          </div>

          <div
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto px-5 py-6 no-scrollbar"
          >
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "rounded-br-md bg-sand text-accent-ink"
                        : "rounded-bl-md border border-line bg-black/[0.04] dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              );
            })}

            {messages.length === 1 ? (
              <div className="flex flex-col gap-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setChatInput(prompt)}
                    className="rounded-xl border border-line px-3.5 py-3 text-left text-xs text-muted transition hover:border-sand/40 hover:bg-sand/[0.04] hover:text-cream"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form onSubmit={handleChatSubmit} className="border-t border-line p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-line bg-black/[0.03] dark:bg-white/[0.03] p-2 transition focus-within:border-sand/50">
              <label htmlFor="support-message" className="sr-only">
                Ask the Radiant Regalia support team
              </label>
              <input
                id="support-message"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Ask about fit, fabric, or availability..."
                className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-zinc-800 dark:text-zinc-200 outline-none placeholder:text-faint"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sand text-accent-ink transition hover:bg-[#E0B68E] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={17} strokeWidth={1.8} />
              </button>
            </div>
            <p className="mt-2 text-center text-[8px] uppercase tracking-[0.2em] text-faint">
              AI styling advice · Availability may change
            </p>
          </form>
        </aside>
      </div>

      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        aria-expanded={isChatOpen}
        aria-controls="radiant-regalia-support"
        className={`fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2.5 rounded-full border border-sand/30 bg-white/95 dark:bg-[#171513]/95 px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream shadow-[0_18px_50px_-15px_rgba(0,0,0,0.9)] backdrop-blur-xl transition duration-300 hover:border-sand/60 hover:text-sand ${
          isChatOpen ? "pointer-events-none translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <Sparkles size={17} className="text-sand" strokeWidth={1.6} />
        Ask Radiant Regalia
      </button>
    </div>
  );
}
