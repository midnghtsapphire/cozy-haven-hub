import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star, Trash2 } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const Wishlist = () => {
  const { items, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product, product.variants[0], 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemove = (product: typeof items[0]) => {
    removeItem(product.id);
    toast.success(`${product.name} removed from wishlist`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blush-light mb-4">
              <Heart className="w-8 h-8 text-lavender-deep" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground">
              Your Wishlist
            </h1>
            <p className="mt-4 text-muted-foreground">
              {items.length === 0
                ? "Save your favorite items for later"
                : `${items.length} item${items.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>

          {items.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-serif font-medium text-foreground mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start adding items you love by clicking the heart icon on any product
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/shop">Browse Products</Link>
              </Button>
            </div>
          ) : (
            /* Wishlist Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => (
                <div key={product.id} className="group relative bg-card rounded-2xl overflow-hidden border border-border">
                  {/* Image */}
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.tag && (
                        <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full bg-background/90 text-foreground backdrop-blur-sm">
                          {product.tag}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <Link to={`/product/${product.id}`}>
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3.5 h-3.5 fill-lavender-deep text-lavender-deep" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                      </div>
                      <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-lavender-deep transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-foreground">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="hero"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(product)}
                        className="px-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
