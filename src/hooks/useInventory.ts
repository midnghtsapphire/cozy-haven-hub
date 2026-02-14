import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface InventoryItem {
  product_id: string;
  variant_id: string;
  stock_quantity: number;
  low_stock_threshold: number;
}

interface PublicInventoryItem {
  product_id: string;
  variant_id: string;
  stock_status: string;
  is_out_of_stock: boolean;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export const useInventory = (productId?: string, variantId?: string) => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem | null>(null);
  const [publicStock, setPublicStock] = useState<PublicInventoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId || !variantId) {
      setLoading(false);
      return;
    }

    const fetchInventory = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("inventory")
          .select("*")
          .eq("product_id", productId)
          .eq("variant_id", variantId)
          .maybeSingle();

        if (!error && data) {
          setInventory(data);
        }
      } else {
        const { data, error } = await supabase
          .from("public_inventory" as any)
          .select("*")
          .eq("product_id", productId)
          .eq("variant_id", variantId)
          .maybeSingle();

        if (!error && data) {
          setPublicStock(data as any);
        }
      }
      setLoading(false);
    };

    fetchInventory();
  }, [productId, variantId, user]);

  const getStockStatus = (): StockStatus => {
    if (publicStock) return publicStock.stock_status as StockStatus;
    if (!inventory) return "in_stock";
    if (inventory.stock_quantity <= 0) return "out_of_stock";
    if (inventory.stock_quantity <= inventory.low_stock_threshold) return "low_stock";
    return "in_stock";
  };

  return {
    inventory,
    loading,
    stockQuantity: inventory?.stock_quantity ?? null,
    stockStatus: getStockStatus(),
    isOutOfStock: publicStock ? publicStock.is_out_of_stock : (inventory ? inventory.stock_quantity <= 0 : false),
  };
};

export const useProductInventory = (productId: string) => {
  const { user } = useAuth();
  const [inventoryMap, setInventoryMap] = useState<Map<string, InventoryItem>>(new Map());
  const [publicStockMap, setPublicStockMap] = useState<Map<string, PublicInventoryItem>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("inventory")
          .select("*")
          .eq("product_id", productId);

        if (!error && data) {
          const map = new Map<string, InventoryItem>();
          data.forEach((item) => map.set(item.variant_id, item));
          setInventoryMap(map);
        }
      } else {
        const { data, error } = await supabase
          .from("public_inventory" as any)
          .select("*")
          .eq("product_id", productId);

        if (!error && data) {
          const map = new Map<string, PublicInventoryItem>();
          (data as any[]).forEach((item: PublicInventoryItem) => map.set(item.variant_id, item));
          setPublicStockMap(map);
        }
      }
      setLoading(false);
    };

    fetchInventory();
  }, [productId, user]);

  const getVariantStock = (variantId: string): InventoryItem | undefined => {
    return inventoryMap.get(variantId);
  };

  const getVariantStockStatus = (variantId: string): StockStatus => {
    const pubItem = publicStockMap.get(variantId);
    if (pubItem) return pubItem.stock_status as StockStatus;
    const item = inventoryMap.get(variantId);
    if (!item) return "in_stock";
    if (item.stock_quantity <= 0) return "out_of_stock";
    if (item.stock_quantity <= item.low_stock_threshold) return "low_stock";
    return "in_stock";
  };

  return {
    inventoryMap,
    loading,
    getVariantStock,
    getVariantStockStatus,
  };
};
