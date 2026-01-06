import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Product, ProductVariant } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "duskglow-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage or database
  useEffect(() => {
    if (user) {
      setLoading(true);
      
      const loadCart = async () => {
        // First get cart items
        const { data: cartData, error: cartError } = await supabase
          .from("carts")
          .select("*")
          .eq("user_id", user.id);

        if (cartError || !cartData || cartData.length === 0) {
          setLoading(false);
          return;
        }

        // Get unique product IDs
        const productIds = [...new Set(cartData.map((item) => item.product_id))];

        // Fetch products with variants from database
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select(`*, product_variants(*)`)
          .in("id", productIds);

        if (productsError || !productsData) {
          setLoading(false);
          return;
        }

        // Map cart items to CartItem format
        const cartItems: CartItem[] = cartData
          .map((item) => {
            const dbProduct = productsData.find((p) => p.id === item.product_id);
            if (!dbProduct) return null;

            const variant = dbProduct.product_variants?.find(
              (v: any) => v.id === item.variant_id
            );
            if (!variant) return null;

            const product: Product = {
              id: dbProduct.id,
              name: dbProduct.name,
              description: dbProduct.description,
              long_description: dbProduct.long_description,
              price: Number(dbProduct.price),
              original_price: dbProduct.original_price ? Number(dbProduct.original_price) : null,
              images: dbProduct.images,
              rating: Number(dbProduct.rating),
              review_count: dbProduct.review_count,
              tag: dbProduct.tag,
              category: dbProduct.category,
              features: dbProduct.features,
              is_active: dbProduct.is_active,
              variants: dbProduct.product_variants?.map((v: any) => ({
                id: v.id,
                name: v.name,
                color: v.color,
                in_stock: v.in_stock,
              })) || [],
            };

            return {
              productId: product.id,
              product,
              variant: {
                id: variant.id,
                name: variant.name,
                color: variant.color,
                in_stock: variant.in_stock,
              },
              quantity: item.quantity,
            };
          })
          .filter(Boolean) as CartItem[];

        setItems(cartItems);
        setLoading(false);
      };

      loadCart();
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      setItems(stored ? JSON.parse(stored) : []);
    }
  }, [user]);

  // Save to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, user]);

  const syncToDatabase = useCallback(async (newItems: CartItem[]) => {
    if (!user) return;
    
    // Delete all existing cart items and insert new ones
    await supabase.from("carts").delete().eq("user_id", user.id);
    
    if (newItems.length > 0) {
      await supabase.from("carts").insert(
        newItems.map((item) => ({
          user_id: user.id,
          product_id: item.productId,
          variant_id: item.variant.id,
          quantity: item.quantity,
        }))
      );
    }
  }, [user]);

  const addItem = useCallback((product: Product, variant: ProductVariant, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variant.id === variant.id
      );

      let newItems: CartItem[];
      if (existingIndex > -1) {
        newItems = [...prev];
        newItems[existingIndex].quantity = Math.min(
          10,
          newItems[existingIndex].quantity + quantity
        );
      } else {
        newItems = [...prev, { productId: product.id, product, variant, quantity }];
      }

      if (user) {
        syncToDatabase(newItems);
      }
      return newItems;
    });
    
    setIsOpen(true);
  }, [user, syncToDatabase]);

  const removeItem = useCallback((productId: string, variantId: string) => {
    setItems((prev) => {
      const newItems = prev.filter(
        (item) => !(item.productId === productId && item.variant.id === variantId)
      );
      if (user) {
        syncToDatabase(newItems);
      }
      return newItems;
    });
  }, [user, syncToDatabase]);

  const updateQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId, variantId);
      return;
    }

    setItems((prev) => {
      const newItems = prev.map((item) =>
        item.productId === productId && item.variant.id === variantId
          ? { ...item, quantity: Math.min(10, quantity) }
          : item
      );
      if (user) {
        syncToDatabase(newItems);
      }
      return newItems;
    });
  }, [user, removeItem, syncToDatabase]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (user) {
      supabase.from("carts").delete().eq("user_id", user.id);
    }
  }, [user]);

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
        loading,
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
