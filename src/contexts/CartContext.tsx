import { createContext, useContext, useState, ReactNode } from "react";
import type { Product, ProductVariant } from "@/data/products";

export interface CartItem {
  productId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product: Product, variant: ProductVariant, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variant.id === variant.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity = Math.min(
          10,
          updated[existingIndex].quantity + quantity
        );
        return updated;
      }

      return [...prev, { productId: product.id, product, variant, quantity }];
    });
    
    setIsOpen(true);
  };

  const removeItem = (productId: string, variantId: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variant.id === variantId)
      )
    );
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variant.id === variantId
          ? { ...item, quantity: Math.min(10, quantity) }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
