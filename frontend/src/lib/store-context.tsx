"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  defaultColor,
  defaultSize,
  findProduct,
  type StoreProduct
} from "./catalog";

export type CartLine = {
  key: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

type AddToCartOptions = {
  size?: string;
  color?: string;
  quantity?: number;
  openCart?: boolean;
};

type StoreContextValue = {
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: StoreProduct, options?: AddToCartOptions) => void;
  removeFromCart: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  wishlistProducts: StoreProduct[];
  toggleWishlist: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  search: string;
  setSearch: (value: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const CART_STORAGE_KEY = "radiant-regalia-cart";
const WISHLIST_STORAGE_KEY = "radiant-regalia-wishlist";

const StoreContext = createContext<StoreContextValue | null>(null);

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;

  return (
    typeof line.key === "string" &&
    typeof line.productId === "string" &&
    typeof line.name === "string" &&
    typeof line.price === "number" &&
    typeof line.image === "string" &&
    typeof line.size === "string" &&
    typeof line.color === "string" &&
    typeof line.quantity === "number" &&
    line.quantity > 0
  );
}

function readStoredCart(): CartLine[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isCartLine);
  } catch {
    return [];
  }
}

function readStoredWishlist(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(readStoredCart());
    setWishlist(readStoredWishlist());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!cartOpen && !wishlistOpen && !menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [cartOpen, wishlistOpen, menuOpen]);

  const addToCart = useCallback((product: StoreProduct, options: AddToCartOptions = {}) => {
    const size = options.size ?? defaultSize(product);
    const color = options.color ?? defaultColor(product);
    const quantity = Math.max(1, Math.min(99, Math.trunc(options.quantity ?? 1)));
    const key = `${product.id}::${size}::${color}`;

    setCart((current) => {
      const existing = current.find((line) => line.key === key);

      if (existing) {
        return current.map((line) =>
          line.key === key
            ? { ...line, quantity: Math.min(99, line.quantity + quantity) }
            : line
        );
      }

      return [
        ...current,
        {
          key,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          color,
          quantity
        }
      ];
    });

    if (options.openCart !== false) {
      setWishlistOpen(false);
      setCartOpen(true);
    }
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((current) => current.filter((line) => line.key !== key));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setCart((current) =>
      current.map((line) =>
        line.key === key
          ? { ...line, quantity: Math.max(1, Math.min(99, Math.trunc(quantity))) }
          : line
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }, []);

  const isFavorite = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const cartCount = useMemo(
    () => cart.reduce((total, line) => total + line.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((total, line) => total + line.price * line.quantity, 0),
    [cart]
  );

  const wishlistProducts = useMemo(
    () =>
      wishlist
        .map((id) => findProduct(id))
        .filter((product): product is StoreProduct => Boolean(product)),
    [wishlist]
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      cartCount,
      subtotal,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      wishlist,
      wishlistProducts,
      toggleWishlist,
      isFavorite,
      search,
      setSearch,
      cartOpen,
      setCartOpen,
      wishlistOpen,
      setWishlistOpen,
      menuOpen,
      setMenuOpen
    }),
    [
      cart,
      cartCount,
      subtotal,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      wishlist,
      wishlistProducts,
      toggleWishlist,
      isFavorite,
      search,
      cartOpen,
      wishlistOpen,
      menuOpen
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return context;
}
