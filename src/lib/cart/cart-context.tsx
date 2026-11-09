"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  isim: string;
  fiyat: number;
  adet: number;
  fotografUrl: string | null;
};

export type OrderType = "teslimat" | "gelal";

type CartState = {
  items: CartItem[];
  not: string;
  orderType: OrderType | null;
};

type AddableProduct = {
  id: string;
  isim: string;
  fiyat: number;
  fotograf_url: string | null;
};

type CartContextValue = CartState & {
  addItem: (product: AddableProduct) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  removeItem: (productId: string) => void;
  setNote: (text: string) => void;
  setOrderType: (type: OrderType) => void;
  clear: () => void;
  itemCount: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "lieferservice_sepet";

const EMPTY_STATE: CartState = { items: [], not: "", orderType: null };

function loadFromStorage(): CartState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.items)) return EMPTY_STATE;
    return {
      items: parsed.items,
      not: typeof parsed.not === "string" ? parsed.not : "",
      orderType:
        parsed.orderType === "teslimat" || parsed.orderType === "gelal"
          ? parsed.orderType
          : null,
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage kullanilamiyor (gizli sekme vb.) - sessizce yoksay
    }
  }, [state, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (product: AddableProduct) => {
      setState((prev) => {
        const existing = prev.items.find((i) => i.productId === product.id);
        if (existing) {
          return {
            ...prev,
            items: prev.items.map((i) =>
              i.productId === product.id ? { ...i, adet: i.adet + 1 } : i
            ),
          };
        }
        return {
          ...prev,
          items: [
            ...prev.items,
            {
              productId: product.id,
              isim: product.isim,
              fiyat: product.fiyat,
              adet: 1,
              fotografUrl: product.fotograf_url,
            },
          ],
        };
      });
    };

    const increment = (productId: string) => {
      setState((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.productId === productId ? { ...i, adet: i.adet + 1 } : i
        ),
      }));
    };

    const decrement = (productId: string) => {
      setState((prev) => ({
        ...prev,
        items: prev.items
          .map((i) =>
            i.productId === productId ? { ...i, adet: i.adet - 1 } : i
          )
          .filter((i) => i.adet > 0),
      }));
    };

    const removeItem = (productId: string) => {
      setState((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.productId !== productId),
      }));
    };

    const setNote = (text: string) => {
      setState((prev) => ({ ...prev, not: text }));
    };

    const setOrderType = (type: OrderType) => {
      setState((prev) => ({ ...prev, orderType: type }));
    };

    const clear = () => {
      setState((prev) => ({ ...EMPTY_STATE, orderType: prev.orderType }));
    };

    const itemCount = state.items.reduce((sum, i) => sum + i.adet, 0);
    const total = state.items.reduce((sum, i) => sum + i.adet * i.fiyat, 0);

    return {
      ...state,
      addItem,
      increment,
      decrement,
      removeItem,
      setNote,
      setOrderType,
      clear,
      itemCount,
      total,
    };
  }, [state]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider icinde kullanilmali");
  return ctx;
}
