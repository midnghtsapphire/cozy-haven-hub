import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useProductInventory } from "@/hooks/useInventory";
import StockIndicator from "@/components/StockIndicator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, ShoppingBag, Star, SlidersHorizontal, X } from "lucide-react";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const categories = [
  { id: "all", name: "All Products", count: products.length },
  { id: "Lighting", name: "Lighting", count: products.filter(p => p.category === "Lighting").length },
  { id: "Scents", name: "Scents", count: products.filter(p => p.category === "Scents").length },
  { id: "Comfort", name: "Comfort", count: products.filter(p => p.category === "Comfort").length },
  { id: "Organization", name: "Organization", count: products.filter(p => p.category === "Organization").length },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

const ProductCard = ({ product }: { product: typeof products[0] }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  const { getVariantStockStatus, getVariantStock } = useProductInventory(product.id);
  
  const defaultVariant = product.variants[0];
  const stockStatus = getVariantStockStatus(defaultVariant.id);
  const stockInfo = getVariantStock(defaultVariant.id);
  const isOutOfStock = stockStatus === "out_of_stock";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, defaultVariant, 1);
    toast.success(`${product.name} added to cart!`, {
      description: defaultVariant.name,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    toast.success(isWishlisted ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`);
  };

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-secondary mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {product.tag && (
            <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium rounded-full bg-background/90 text-foreground backdrop-blur-sm">
              {product.tag}
            </span>
          )}

          <button 
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-blush-light",
              isWishlisted ? "bg-blush-light opacity-100" : "bg-background/90 opacity-0 group-hover:opacity-100"
            )}
          >
            <Heart className={cn("w-5 h-5", isWishlisted ? "fill-lavender-deep text-lavender-deep" : "text-foreground")} />
          </button>

          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button 
              variant="hero" 
              className="w-full" 
              size="lg"
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
            >
              <ShoppingBag className="w-4 h-4" />
              {isOutOfStock ? "Out of Stock" : "Quick Add"}
            </Button>
          </div>
        </div>
      </Link>

      <Link to={`/product/${product.id}`} className="block space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-lavender-deep text-lavender-deep" />
            <span className="text-sm font-medium text-foreground">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
          </div>
          {stockStatus !== "in_stock" && (
            <StockIndicator 
              status={stockStatus} 
              quantity={stockInfo?.stock_quantity}
              showQuantity={stockStatus === "low_stock"}
              size="sm"
            />
          )}
        </div>
        
        <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-lavender-deep transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-muted-foreground">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
          )}
        </div>
      </Link>
    </div>
  );
};

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        // Featured - keep original order
        break;
    }

    return result;
  }, [selectedCategory, sortBy]);

  const activeCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-4">
              Shop the Sanctuary
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Curated essentials for focus, comfort, and calm. Find your perfect cozy companions.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="font-medium text-foreground mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200",
                          selectedCategory === category.id
                            ? "bg-blush-light text-plum font-medium"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <span>{category.name}</span>
                        <span className={cn(
                          "text-sm",
                          selectedCategory === category.id ? "text-lavender-deep" : "text-muted-foreground"
                        )}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-secondary/30 border border-border">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                {/* Results Count */}
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredAndSortedProducts.length}</span> products
                  {selectedCategory !== "all" && (
                    <> in <span className="font-medium text-foreground">{activeCategory?.name}</span></>
                  )}
                </p>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[180px] rounded-full bg-card border-border">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              {selectedCategory !== "all" && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blush-light text-plum text-sm">
                    {activeCategory?.name}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="w-4 h-4 rounded-full bg-plum/20 flex items-center justify-center hover:bg-plum/30 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              )}

              {/* Products Grid */}
              {filteredAndSortedProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground mb-4">No products found in this category.</p>
                  <Button variant="soft" onClick={() => setSelectedCategory("all")}>
                    View All Products
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-medium text-foreground">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowMobileFilters(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-4 rounded-xl text-left transition-all duration-200",
                    selectedCategory === category.id
                      ? "bg-blush-light text-plum font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <span>{category.name}</span>
                  <span className={cn(
                    "text-sm",
                    selectedCategory === category.id ? "text-lavender-deep" : "text-muted-foreground"
                  )}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            <Button 
              variant="hero" 
              className="w-full" 
              size="xl"
              onClick={() => setShowMobileFilters(false)}
            >
              Show {filteredAndSortedProducts.length} Products
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Shop;
