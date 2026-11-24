"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Minus,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X
} from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";

const CATEGORY_OPTIONS = [
  "Dresses",
  "Tops",
  "Outerwear",
  "Pants",
  "Shoes",
  "Bags",
  "Accessories"
] as const;

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

type CategoryOption = (typeof CATEGORY_OPTIONS)[number];
type SizeOption = (typeof SIZE_OPTIONS)[number];

type Variant = {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  inventoryCount: number;
  variantPrice: number;
  createdAt: string;
};

type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId: string | null;
  basePrice: number;
  isArchived: boolean;
  createdAt: string;
  variantCount: number;
  stockTotal: number;
  variants: Variant[];
};

type InventoryPayload = {
  currency: string;
  count: number;
  products: Product[];
};

type Row = Variant & {
  productTitle: string;
  category: string;
};

type FormState = {
  title: string;
  category: CategoryOption;
  basePrice: string;
  sku: string;
  size: SizeOption;
  color: string;
  inventoryCount: string;
};

type EditingState = { variantId: string; productId: string } | null;

function emptyForm(): FormState {
  return {
    title: "",
    category: "Dresses",
    basePrice: "",
    sku: "",
    size: "M",
    color: "",
    inventoryCount: "0"
  };
}

function formatKSh(value: number): string {
  return `KSh ${value.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

async function readError(response: Response): Promise<string> {
  const payload = (await response.clone().json().catch(() => null)) as { error?: string } | null;

  if (payload?.error) {
    return payload.error;
  }

  const text = await response.text().catch(() => "");
  return text.trim() || `Request failed with status ${response.status}`;
}

function stockTone(count: number): string {
  if (count === 0) {
    return "border-[var(--inv-danger)] bg-[var(--inv-danger)]/10 text-[var(--inv-danger)]";
  }

  if (count <= 5) {
    return "border-[var(--inv-sand)] bg-[var(--inv-sand-soft)] text-[var(--inv-sand)]";
  }

  return "border-[var(--inv-success)] bg-[var(--inv-success)]/10 text-[var(--inv-success)]";
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<EditingState>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/inventory", { cache: "no-store" });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const payload = (await response.json()) as InventoryPayload;
      setProducts(payload.products);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load the inventory right now."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!drawerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();

    return products
      .flatMap<Row>((product) =>
        product.variants.map((variant) => ({
          ...variant,
          productTitle: product.title,
          category: product.category
        }))
      )
      .filter((row) =>
        [row.productTitle, row.sku, row.color, row.size, row.category]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [products, query]);

  const totalSkus = products.reduce((total, product) => total + product.variantCount, 0);
  const totalStock = products.reduce((total, product) => total + product.stockTotal, 0);
  const lowStock = rows.filter((row) => row.inventoryCount <= 5).length;

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDrawerOpen(true);
  };

  const openEdit = (row: Row) => {
    setEditing({ variantId: row.id, productId: row.productId });
    setForm({
      title: row.productTitle,
      category: CATEGORY_OPTIONS.includes(row.category as CategoryOption)
        ? (row.category as CategoryOption)
        : "Accessories",
      basePrice: row.variantPrice.toFixed(2),
      sku: row.sku,
      size: SIZE_OPTIONS.includes(row.size as SizeOption) ? (row.size as SizeOption) : "M",
      color: row.color,
      inventoryCount: String(row.inventoryCount)
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);

    const price = Number(form.basePrice);
    const stock = Number(form.inventoryCount);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid KSh price.");
      setSaving(false);
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Initial stock must be a whole number of zero or more.");
      setSaving(false);
      return;
    }

    try {
      const headers = { "content-type": "application/json" };

      if (editing) {
        const productResponse = await fetch(`/api/inventory/${editing.productId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            kind: "product",
            title: form.title,
            category: form.category,
            basePrice: price
          })
        });

        if (!productResponse.ok) throw new Error(await readError(productResponse));

        const variantResponse = await fetch(`/api/inventory/${editing.variantId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            kind: "variant",
            inventoryCount: stock,
            variantPrice: price
          })
        });

        if (!variantResponse.ok) throw new Error(await readError(variantResponse));
        setNotice(`${form.title} updated in the collection.`);
      } else {
        const response = await fetch("/api/inventory", {
          method: "POST",
          headers,
          body: JSON.stringify({
            title: form.title,
            category: form.category,
            basePrice: price,
            sku: form.sku,
            size: form.size,
            color: form.color,
            inventoryCount: stock
          })
        });

        if (!response.ok) throw new Error(await readError(response));
        setNotice(`${form.title} added to the collection.`);
      }

      setDrawerOpen(false);
      setEditing(null);
      setForm(emptyForm());
      await loadInventory();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to save this piece right now."
      );
    } finally {
      setSaving(false);
    }
  };

  const adjustStock = async (row: Row, delta: number) => {
    const nextCount = Math.max(0, row.inventoryCount + delta);

    setPendingId(row.id);
    setError(null);
    setProducts((previous) =>
      previous.map((product) => {
        const variants = product.variants.map((variant) =>
          variant.id === row.id ? { ...variant, inventoryCount: nextCount } : variant
        );

        return {
          ...product,
          variants,
          stockTotal: variants.reduce((total, variant) => total + variant.inventoryCount, 0)
        };
      })
    );

    try {
      const response = await fetch(`/api/inventory/${row.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "variant", inventoryCount: nextCount })
      });

      if (!response.ok) throw new Error(await readError(response));
      setNotice(`Stock updated for ${row.sku}.`);
    } catch (adjustError) {
      setProducts((previous) =>
        previous.map((product) => {
          const variants = product.variants.map((variant) =>
            variant.id === row.id ? { ...variant, inventoryCount: row.inventoryCount } : variant
          );

          return {
            ...product,
            variants,
            stockTotal: variants.reduce((total, variant) => total + variant.inventoryCount, 0)
          };
        })
      );
      setError(
        adjustError instanceof Error ? adjustError.message : "Unable to adjust stock right now."
      );
    } finally {
      setPendingId(null);
    }
  };

  const deleteRow = async (row: Row) => {
    const confirmed = window.confirm(
      `Remove ${row.sku} from inventory? This action cannot be undone.`
    );

    if (!confirmed) return;

    setPendingId(row.id);
    setError(null);

    try {
      const response = await fetch(`/api/inventory/${row.id}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "variant" })
      });

      if (!response.ok) throw new Error(await readError(response));
      setNotice(`${row.sku} removed from inventory.`);
      await loadInventory();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Unable to remove this piece right now."
      );
    } finally {
      setPendingId(null);
    }
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-[var(--inv-border)] bg-[var(--inv-input)] px-3.5 text-sm text-[var(--inv-text)] outline-none transition placeholder:text-[var(--inv-muted)] focus:border-[var(--inv-sand)]";

  return (
    <div className="admin-shell min-h-screen">
      <AdminSidebar />

      <div className="lg:pl-[280px]">
        <main className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <header className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[var(--inv-sand)]">
                Atelier operations
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-none tracking-tight text-[var(--inv-text)] sm:text-5xl">
                Inventory Management
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--inv-muted)]">
                Curate the collection, tune pricing in KSh, and keep every SKU ready for the floor.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="flex h-12 items-center gap-2 rounded-full bg-[var(--inv-sand)] px-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#121212] transition hover:brightness-95"
            >
              <Plus size={16} />
              Add New Regalia
            </button>
          </header>

          <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Inventory summary">
            {[
              { label: "Active SKUs", value: totalSkus },
              { label: "Units in stock", value: totalStock },
              { label: "Low stock lines", value: lowStock }
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[var(--inv-border)] bg-[var(--inv-panel)] px-5 py-4"
              >
                <p className="font-serif text-3xl text-[var(--inv-text)]">{stat.value}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-[var(--inv-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </section>

          {error ? (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-[var(--inv-danger)] bg-[var(--inv-danger)]/10 px-4 py-3 text-sm text-[var(--inv-danger)]"
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          {notice ? (
            <div
              role="status"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-[var(--inv-success)] bg-[var(--inv-success)]/10 px-4 py-3 text-sm text-[var(--inv-success)]"
            >
              <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
              <span>{notice}</span>
            </div>
          ) : null}

          <section className="mt-8 overflow-hidden rounded-[1.75rem] border border-[var(--inv-border)] bg-[var(--inv-panel)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--inv-border)] px-5 py-4">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-[var(--inv-sand)]" />
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-text)]">
                  Collection stock
                </h2>
              </div>

              <label className="flex h-10 w-full items-center gap-2 rounded-full border border-[var(--inv-border)] bg-[var(--inv-input)] px-4 sm:w-72">
                <Search size={15} className="text-[var(--inv-muted)]" />
                <span className="sr-only">Search inventory</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search SKU, piece, or colour"
                  className="w-full bg-transparent text-xs text-[var(--inv-text)] outline-none placeholder:text-[var(--inv-muted)]"
                />
              </label>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-[var(--inv-muted)]">
                <Loader2 size={17} className="animate-spin text-[var(--inv-sand)]" />
                Loading the collection...
              </div>
            ) : rows.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <Package size={26} className="mx-auto text-[var(--inv-sand)]" />
                <p className="mt-4 font-serif text-xl text-[var(--inv-text)]">
                  {query ? "No pieces match that search" : "The collection is waiting"}
                </p>
                <p className="mt-2 text-xs text-[var(--inv-muted)]">
                  {query
                    ? "Try a different SKU, title, or colour."
                    : "Add your first regalia to begin managing stock."}
                </p>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[820px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[var(--inv-border)] text-[9px] uppercase tracking-[0.2em] text-[var(--inv-muted)]">
                        <th className="px-5 py-4 font-semibold">Product</th>
                        <th className="px-4 py-4 font-semibold">SKU</th>
                        <th className="px-4 py-4 font-semibold">Variant</th>
                        <th className="px-4 py-4 font-semibold">Price</th>
                        <th className="px-4 py-4 font-semibold">Stock</th>
                        <th className="px-5 py-4 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-[var(--inv-border)] last:border-0 hover:bg-[var(--inv-panel-soft)]"
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-[var(--inv-text)]">{row.productTitle}</p>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--inv-muted)]">
                              {row.category}
                            </p>
                          </td>
                          <td className="px-4 py-4 font-mono text-[11px] text-[var(--inv-muted)]">{row.sku}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              <span className="rounded-full border border-[var(--inv-border)] bg-[var(--inv-panel-soft)] px-2.5 py-1 text-[10px] text-[var(--inv-text)]">
                                {row.size}
                              </span>
                              <span className="rounded-full border border-[var(--inv-border)] bg-[var(--inv-panel-soft)] px-2.5 py-1 text-[10px] text-[var(--inv-text)]">
                                {row.color}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-[var(--inv-text)]">
                            {formatKSh(row.variantPrice)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                aria-label={`Decrease stock for ${row.sku}`}
                                onClick={() => void adjustStock(row, -1)}
                                disabled={pendingId === row.id}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--inv-border)] text-[var(--inv-muted)] transition hover:border-[var(--inv-sand)] hover:text-[var(--inv-sand)] disabled:opacity-50"
                              >
                                <Minus size={13} />
                              </button>
                              <span
                                className={`min-w-10 rounded-full border px-2.5 py-1 text-center text-xs font-semibold ${stockTone(row.inventoryCount)}`}
                              >
                                {row.inventoryCount}
                              </span>
                              <button
                                type="button"
                                aria-label={`Increase stock for ${row.sku}`}
                                onClick={() => void adjustStock(row, 1)}
                                disabled={pendingId === row.id}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--inv-border)] text-[var(--inv-muted)] transition hover:border-[var(--inv-sand)] hover:text-[var(--inv-sand)] disabled:opacity-50"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                aria-label={`Edit ${row.sku}`}
                                onClick={() => openEdit(row)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--inv-border)] text-[var(--inv-muted)] transition hover:border-[var(--inv-sand)] hover:text-[var(--inv-sand)]"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                aria-label={`Delete ${row.sku}`}
                                onClick={() => void deleteRow(row)}
                                disabled={pendingId === row.id}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--inv-border)] text-[var(--inv-muted)] transition hover:border-[var(--inv-danger)] hover:text-[var(--inv-danger)] disabled:opacity-50"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="divide-y divide-[var(--inv-border)] md:hidden">
                  {rows.map((row) => (
                    <article key={row.id} className="px-4 py-5 sm:px-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--inv-text)]">{row.productTitle}</p>
                          <p className="mt-1 font-mono text-[10px] text-[var(--inv-muted)]">{row.sku}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            aria-label={`Edit ${row.sku}`}
                            onClick={() => openEdit(row)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--inv-border)] text-[var(--inv-muted)]"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${row.sku}`}
                            onClick={() => void deleteRow(row)}
                            disabled={pendingId === row.id}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--inv-border)] text-[var(--inv-danger)] disabled:opacity-50"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full border border-[var(--inv-border)] bg-[var(--inv-panel-soft)] px-2.5 py-1 text-[10px] text-[var(--inv-text)]">
                          {row.size}
                        </span>
                        <span className="rounded-full border border-[var(--inv-border)] bg-[var(--inv-panel-soft)] px-2.5 py-1 text-[10px] text-[var(--inv-text)]">
                          {row.color}
                        </span>
                        <span className="rounded-full border border-[var(--inv-border)] bg-[var(--inv-panel-soft)] px-2.5 py-1 text-[10px] text-[var(--inv-muted)]">
                          {row.category}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-sm text-[var(--inv-text)]">{formatKSh(row.variantPrice)}</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Decrease stock for ${row.sku}`}
                            onClick={() => void adjustStock(row, -1)}
                            disabled={pendingId === row.id}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--inv-border)] text-[var(--inv-muted)] disabled:opacity-50"
                          >
                            <Minus size={13} />
                          </button>
                          <span
                            className={`min-w-10 rounded-full border px-2.5 py-1 text-center text-xs font-semibold ${stockTone(row.inventoryCount)}`}
                          >
                            {row.inventoryCount}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase stock for ${row.sku}`}
                            onClick={() => void adjustStock(row, 1)}
                            disabled={pendingId === row.id}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--inv-border)] text-[var(--inv-muted)] disabled:opacity-50"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        </main>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close product form"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="inventory-form-title"
            className="inventory-drawer relative flex h-full w-full max-w-md flex-col border-l border-[var(--inv-border)] bg-[var(--inv-panel)] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--inv-border)] px-6 py-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--inv-sand)]">
                  {editing ? "Refine the piece" : "New arrival"}
                </p>
                <h2 id="inventory-form-title" className="mt-2 font-serif text-2xl text-[var(--inv-text)]">
                  {editing ? "Edit Regalia" : "Add New Regalia"}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--inv-border)] text-[var(--inv-muted)] transition hover:border-[var(--inv-sand)] hover:text-[var(--inv-sand)]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-1 flex-col">
              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                <label className="block">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-muted)]">
                    Product title
                  </span>
                  <input
                    required
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="e.g. Beige Trench Coat"
                    className={`mt-2 ${inputClass}`}
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-muted)]">
                      Category
                    </span>
                    <select
                      value={form.category}
                      onChange={(event) =>
                        updateField("category", event.target.value as CategoryOption)
                      }
                      className={`mt-2 ${inputClass}`}
                    >
                      {CATEGORY_OPTIONS.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-muted)]">
                      Price (KSh)
                    </span>
                    <input
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      inputMode="decimal"
                      value={form.basePrice}
                      onChange={(event) => updateField("basePrice", event.target.value)}
                      placeholder="12999.00"
                      className={`mt-2 ${inputClass}`}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-muted)]">
                    SKU code
                  </span>
                  <input
                    required
                    value={form.sku}
                    onChange={(event) => updateField("sku", event.target.value)}
                    placeholder="RR-OUT-TRN-BEG-M"
                    className={`mt-2 font-mono ${inputClass}`}
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-muted)]">
                      Size
                    </span>
                    <select
                      value={form.size}
                      onChange={(event) => updateField("size", event.target.value as SizeOption)}
                      className={`mt-2 ${inputClass}`}
                    >
                      {SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-muted)]">
                      Color
                    </span>
                    <input
                      required
                      value={form.color}
                      onChange={(event) => updateField("color", event.target.value)}
                      placeholder="Onyx Black"
                      className={`mt-2 ${inputClass}`}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-muted)]">
                    Initial stock quantity
                  </span>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={form.inventoryCount}
                    onChange={(event) => updateField("inventoryCount", event.target.value)}
                    className={`mt-2 ${inputClass}`}
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[var(--inv-border)] px-6 py-5">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="h-11 rounded-full border border-[var(--inv-border)] px-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--inv-muted)] transition hover:border-[var(--inv-sand)] hover:text-[var(--inv-sand)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-11 items-center gap-2 rounded-full bg-[var(--inv-sand)] px-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#121212] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  {saving ? "Saving" : editing ? "Save changes" : "Add to collection"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
