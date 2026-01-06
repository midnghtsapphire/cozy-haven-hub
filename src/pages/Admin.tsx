import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { toast } from "sonner";
import { Loader2, Package, Save, AlertTriangle, ShieldAlert } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InventoryItem {
  id: string;
  product_id: string;
  variant_id: string;
  stock_quantity: number;
  low_stock_threshold: number;
}

interface InventoryEdit {
  stock_quantity: number;
  low_stock_threshold: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, InventoryEdit>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && !isAdmin && user) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAdmin, adminLoading, user, navigate]);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!isAdmin) return;
      
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .order("product_id", { ascending: true });

      if (!error && data) {
        setInventory(data);
      }
      setLoading(false);
    };

    if (isAdmin) {
      fetchInventory();
    }
  }, [isAdmin]);

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || `Product ${productId}`;
  };

  const getVariantName = (productId: string, variantId: string) => {
    const product = products.find((p) => p.id === productId);
    const variant = product?.variants.find((v) => v.id === variantId);
    return variant?.name || variantId;
  };

  const handleEdit = (itemId: string, field: keyof InventoryEdit, value: number) => {
    setEdits((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const getCurrentValue = (item: InventoryItem, field: keyof InventoryEdit): number => {
    return edits[item.id]?.[field] ?? item[field];
  };

  const hasChanges = (itemId: string) => {
    return edits[itemId] !== undefined;
  };

  const handleSave = async (item: InventoryItem) => {
    const changes = edits[item.id];
    if (!changes) return;

    setSaving(item.id);

    const { error } = await supabase
      .from("inventory")
      .update({
        stock_quantity: changes.stock_quantity ?? item.stock_quantity,
        low_stock_threshold: changes.low_stock_threshold ?? item.low_stock_threshold,
      })
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to update inventory");
    } else {
      toast.success("Inventory updated successfully");
      setInventory((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                stock_quantity: changes.stock_quantity ?? i.stock_quantity,
                low_stock_threshold: changes.low_stock_threshold ?? i.low_stock_threshold,
              }
            : i
        )
      );
      setEdits((prev) => {
        const newEdits = { ...prev };
        delete newEdits[item.id];
        return newEdits;
      });
    }

    setSaving(null);
  };

  const getStockStatusColor = (quantity: number, threshold: number) => {
    if (quantity <= 0) return "text-destructive";
    if (quantity <= threshold) return "text-amber-600";
    return "text-sage-deep";
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-lavender-deep" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 text-center">
            <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-medium text-foreground mb-2">
              Access Denied
            </h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-lavender-mist flex items-center justify-center">
                <Package className="w-5 h-5 text-lavender-deep" />
              </div>
              <h1 className="text-3xl font-serif font-medium text-foreground">
                Inventory Management
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage stock levels and low stock thresholds for all products.
            </p>
          </div>

          {/* Inventory Table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 w-24" />
                  </div>
                ))}
              </div>
            ) : inventory.length === 0 ? (
              <div className="p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No inventory records found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Product / Variant</TableHead>
                    <TableHead className="text-center">Current Stock</TableHead>
                    <TableHead className="text-center">Low Stock Threshold</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const stockQty = getCurrentValue(item, "stock_quantity");
                    const threshold = getCurrentValue(item, "low_stock_threshold");
                    const statusColor = getStockStatusColor(stockQty, threshold);

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {getProductName(item.product_id)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getVariantName(item.product_id, item.variant_id)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min={0}
                            value={stockQty}
                            onChange={(e) =>
                              handleEdit(item.id, "stock_quantity", parseInt(e.target.value) || 0)
                            }
                            className="w-24 mx-auto text-center"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min={0}
                            value={threshold}
                            onChange={(e) =>
                              handleEdit(item.id, "low_stock_threshold", parseInt(e.target.value) || 0)
                            }
                            className="w-24 mx-auto text-center"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={cn(
                              "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                              stockQty <= 0
                                ? "bg-destructive/10 text-destructive"
                                : stockQty <= threshold
                                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20"
                                : "bg-sage/20 text-sage-deep"
                            )}
                          >
                            {stockQty <= 0
                              ? "Out of Stock"
                              : stockQty <= threshold
                              ? "Low Stock"
                              : "In Stock"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="soft"
                            size="sm"
                            onClick={() => handleSave(item)}
                            disabled={!hasChanges(item.id) || saving === item.id}
                          >
                            {saving === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            Save
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
