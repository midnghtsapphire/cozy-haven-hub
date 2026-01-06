import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ProductCard = ({ product }: { product: typeof products[0] }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.variants[0], 1);
    toast.success(`${product.name} added to cart!`, {
      description: product.variants[0].name,
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
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-secondary mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Tag */}
          {product.tag && (
            <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium rounded-full bg-background/90 text-foreground backdrop-blur-sm">
              {product.tag}
            </span>
          )}

          {/* Wishlist Button */}
          <button 
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-blush-light",
              isWishlisted ? "bg-blush-light opacity-100" : "bg-background/90 opacity-0 group-hover:opacity-100"
            )}
          >
            <Heart className={cn("w-5 h-5", isWishlisted ? "fill-lavender-deep text-lavender-deep" : "text-foreground")} />
          </button>

          {/* Quick Add */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button 
              variant="hero" 
              className="w-full" 
              size="lg"
              onClick={handleQuickAdd}
            >
              <ShoppingBag className="w-4 h-4" />
              Quick Add
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <Link to={`/product/${product.id}`} className="block space-y-2">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-lavender-deep text-lavender-deep" />
          <span className="text-sm font-medium text-foreground">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
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

const ProductsSection = () => {
  // Show only first 3 products on homepage
  const displayProducts = products.slice(0, 3);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-lavender-deep tracking-wider uppercase">
            Curated for You
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-medium text-foreground">
            Sanctuary Essentials
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Everything you need to create your perfect cozy corner
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="soft" size="xl" asChild>
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
