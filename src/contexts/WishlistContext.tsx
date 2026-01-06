import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product, products } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
  itemCount: number;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "duskglow-wishlist";

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from localStorage or database
  useEffect(() => {
    if (user) {
      // Load from database
      setLoading(true);
      supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", user.id)
        .then(({ data, error }) => {
          if (!error && data) {
            const wishlistProducts = data
              .map((item) => products.find((p) => p.id === item.product_id))
              .filter(Boolean) as Product[];
            setItems(wishlistProducts);
          }
          setLoading(false);
        });
    } else {
      // Load from localStorage
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

  const addItem = useCallback(async (product: Product) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });

    if (user) {
      await supabase.from("wishlists").insert({
        user_id: user.id,
        product_id: product.id,
      });
    }
  }, [user]);

  const removeItem = useCallback(async (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));

    if (user) {
      await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
    }
  }, [user]);

  const isInWishlist = useCallback((productId: string) => {
    return items.some((item) => item.id === productId);
  }, [items]);

  const toggleItem = useCallback((product: Product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  }, [isInWishlist, addItem, removeItem]);

  const itemCount = items.length;

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, isInWishlist, toggleItem, itemCount, loading }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
