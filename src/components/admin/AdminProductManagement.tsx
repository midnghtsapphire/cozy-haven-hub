import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ProductVariant {
  id: string;
  name: string;
  color: string | null;
  in_stock: boolean;
}

interface Product {
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
  product_variants?: ProductVariant[];
}

interface ProductFormData {
  name: string;
  description: string;
  long_description: string;
  price: string;
  original_price: string;
  images: string[];
  tag: string;
  category: string;
  features: string[];
  is_active: boolean;
}

const emptyFormData: ProductFormData = {
  name: "",
  description: "",
  long_description: "",
  price: "",
  original_price: "",
  images: [""],
  tag: "",
  category: "",
  features: [""],
  is_active: true,
};

const AdminProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyFormData);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`*, product_variants(*)`)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load products");
      console.error(error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData(emptyFormData);
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      long_description: product.long_description,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      images: product.images.length > 0 ? product.images : [""],
      tag: product.tag || "",
      category: product.category,
      features: product.features.length > 0 ? product.features : [""],
      is_active: product.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);

    const productData = {
      name: formData.name,
      description: formData.description,
      long_description: formData.long_description,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      images: formData.images.filter((img) => img.trim() !== ""),
      tag: formData.tag || null,
      category: formData.category,
      features: formData.features.filter((f) => f.trim() !== ""),
      is_active: formData.is_active,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("Failed to update product");
        console.error(error);
      } else {
        toast.success("Product updated successfully");
        setDialogOpen(false);
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("products").insert(productData);

      if (error) {
        toast.error("Failed to create product");
        console.error(error);
      } else {
        toast.success("Product created successfully");
        setDialogOpen(false);
        fetchProducts();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      toast.error("Failed to delete product");
      console.error(error);
    } else {
      toast.success("Product deleted successfully");
      fetchProducts();
    }
  };

  const toggleActive = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);

    if (error) {
      toast.error("Failed to update product");
    } else {
      fetchProducts();
    }
  };

  const addArrayItem = (field: "images" | "features") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field: "images" | "features", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateArrayItem = (field: "images" | "features", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-lavender-deep" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Products ({products.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Create Product"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Lighting, Scents"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief product description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_description">Long Description</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, long_description: e.target.value }))}
                  placeholder="Detailed product description"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, original_price: e.target.value }))}
                    placeholder="For sale display"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tag">Tag</Label>
                  <Input
                    id="tag"
                    value={formData.tag}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
                    placeholder="e.g., Best Seller"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Image URLs</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => addArrayItem("images")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={image}
                      onChange={(e) => updateArrayItem("images", index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.images.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem("images", index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Features</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => addArrayItem("features")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateArrayItem("features", index, e.target.value)}
                      placeholder="Product feature"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem("features", index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active (visible to customers)</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingProduct ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-secondary"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${product.price.toFixed(2)}</div>
                    {product.original_price && (
                      <div className="text-xs text-muted-foreground line-through">
                        ${product.original_price.toFixed(2)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{product.product_variants?.length || 0}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.is_active ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleActive(product)}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No products yet. Create your first product!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductManagement;
