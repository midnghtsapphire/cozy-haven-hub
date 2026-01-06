import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface InventoryItem {
  product_id: string;
  variant_id: string;
  stock_quantity: number;
  low_stock_threshold: number;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export const useInventory = (productId?: string, variantId?: string) => {
  const [inventory, setInventory] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId || !variantId) {
      setLoading(false);
      return;
    }

    const fetchInventory = async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("product_id", productId)
        .eq("variant_id", variantId)
        .maybeSingle();

      if (!error && data) {
        setInventory(data);
      }
      setLoading(false);
    };

    fetchInventory();
  }, [productId, variantId]);

  const getStockStatus = (): StockStatus => {
    if (!inventory) return "in_stock"; // Default if no inventory record
    if (inventory.stock_quantity <= 0) return "out_of_stock";
    if (inventory.stock_quantity <= inventory.low_stock_threshold) return "low_stock";
    return "in_stock";
  };

  return {
    inventory,
    loading,
    stockQuantity: inventory?.stock_quantity ?? null,
    stockStatus: getStockStatus(),
    isOutOfStock: inventory ? inventory.stock_quantity <= 0 : false,
  };
};

export const useProductInventory = (productId: string) => {
  const [inventoryMap, setInventoryMap] = useState<Map<string, InventoryItem>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("product_id", productId);

      if (!error && data) {
        const map = new Map<string, InventoryItem>();
        data.forEach((item) => map.set(item.variant_id, item));
        setInventoryMap(map);
      }
      setLoading(false);
    };

    fetchInventory();
  }, [productId]);

  const getVariantStock = (variantId: string): InventoryItem | undefined => {
    return inventoryMap.get(variantId);
  };

  const getVariantStockStatus = (variantId: string): StockStatus => {
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
