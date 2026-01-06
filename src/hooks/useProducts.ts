import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProductVariant {
  id: string;
  name: string;
  color: string | null;
  in_stock: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  long_description: string;
  price: number;
  original_price: number | null;
  images: string[];
  rating: number;
  review_count: number;
  tag: string | null;
  category: string;
  features: string[];
  is_active: boolean;
  variants: ProductVariant[];
}

interface DBProduct {
  id: string;
  name: string;
  description: string;
  long_description: string;
  price: number;
  original_price: number | null;
  images: string[];
  rating: number;
  review_count: number;
  tag: string | null;
  category: string;
  features: string[];
  is_active: boolean;
  product_variants: {
    id: string;
    name: string;
    color: string | null;
    in_stock: boolean;
  }[];
}

// Transform DB product to frontend product format
const transformProduct = (dbProduct: DBProduct): Product => ({
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
  variants: dbProduct.product_variants.map((v) => ({
    id: v.id,
    name: v.name,
    color: v.color,
    in_stock: v.in_stock,
  })),
});

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, product_variants(*)`)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch products:", error);
        setError(error.message);
      } else {
        setProducts((data as DBProduct[]).map(transformProduct));
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = [{ id: "all", name: "All Products", count: products.length }];
    const categoryMap = new Map<string, number>();
    
    products.forEach((p) => {
      categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
    });

    categoryMap.forEach((count, name) => {
      cats.push({ id: name, name, count });
    });

    return cats;
  }, [products]);

  return { products, loading, error, categories };
};

export const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, product_variants(*)`)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch product:", error);
        setError(error.message);
      } else if (data) {
        setProduct(transformProduct(data as DBProduct));
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

export const useRelatedProducts = (currentProductId: string | undefined, limit = 3) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, product_variants(*)`)
        .eq("is_active", true)
        .neq("id", currentProductId || "")
        .limit(limit);

      if (!error && data) {
        setProducts((data as DBProduct[]).map(transformProduct));
      }
      setLoading(false);
    };

    fetchRelated();
  }, [currentProductId, limit]);

  return { products, loading };
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from("products")
    .select(`*, product_variants(*)`)
    .eq("is_active", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,long_description.ilike.%${query}%`);

  if (error) {
    console.error("Search failed:", error);
    return [];
  }

  return (data as DBProduct[]).map(transformProduct);
};
