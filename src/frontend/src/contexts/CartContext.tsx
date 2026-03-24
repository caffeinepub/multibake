import { type ReactNode, createContext, useContext, useState } from "react";

export interface CartItem {
  sku: string;
  name: string;
  priceCents: number;
  quantity: number;
  image: string;
  unit: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (sku: string) => void;
  updateQty: (sku: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalCents: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalCents: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.sku === item.sku);
      if (existing) {
        return prev.map((i) =>
          i.sku === item.sku ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (sku: string) => {
    setItems((prev) => prev.filter((i) => i.sku !== sku));
  };

  const updateQty = (sku: string, qty: number) => {
    if (qty <= 0) {
      removeItem(sku);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.sku === sku ? { ...i, quantity: qty } : i)),
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = items.reduce(
    (sum, i) => sum + i.priceCents * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalCents,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
