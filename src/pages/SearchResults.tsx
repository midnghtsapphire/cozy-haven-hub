import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Heart, Search, ShoppingBag, Star } from "lucide-react";

const ProductCard = ({ product }: { product: typeof products[0] }) => {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.variants[0], 1);
    toast.success(`${product.name} added to cart!`, {
      description: product.variants[0].name,
    });
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blush-light"
          >
            <Heart className="w-5 h-5 text-foreground" />
          </button>

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

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.longDescription.toLowerCase().includes(lowerQuery) ||
        p.variants.some((v) => v.name.toLowerCase().includes(lowerQuery))
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-12 animate-fade-in-up">
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <Search className="w-5 h-5" />
              <span>Search results for</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-2">
              "{query}"
            </h1>
            <p className="text-muted-foreground">
              {results.length} {results.length === 1 ? "product" : "products"} found
            </p>
          </div>

          {/* Results */}
          {results.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-serif font-medium text-foreground mb-3">
                No results found
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                We couldn't find any products matching "{query}". Try a different search term or browse our collection.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="hero" asChild>
                  <Link to="/shop">Browse All Products</Link>
                </Button>
                <Button variant="soft" asChild>
                  <Link to="/quiz">Take the Quiz</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Suggestions when results exist */}
          {results.length > 0 && results.length < products.length && (
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                Looking for more? Check out our full collection
              </p>
              <Button variant="soft" size="lg" asChild>
                <Link to="/shop">View All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
