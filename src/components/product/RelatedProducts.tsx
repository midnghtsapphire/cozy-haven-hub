import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useRelatedProducts, Product } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedProductsProps {
  currentProductId: string;
}

const RelatedProductCard = ({ product }: { product: Product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl bg-secondary mb-4">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {product.tag && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full bg-background/90 text-foreground backdrop-blur-sm">
            {product.tag}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-lavender-deep text-lavender-deep" />
          <span className="text-sm font-medium text-foreground">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.review_count})</span>
        </div>
        
        <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-lavender-deep transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-muted-foreground">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">${product.price}</span>
          {product.original_price && (
            <span className="text-sm text-muted-foreground line-through">${product.original_price}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

const ProductSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="w-full aspect-square rounded-2xl" />
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-4 w-40" />
    <Skeleton className="h-5 w-16" />
  </div>
);

const RelatedProducts = ({ currentProductId }: RelatedProductsProps) => {
  const { products, loading } = useRelatedProducts(currentProductId, 3);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-16 border-t border-border">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-serif font-medium text-foreground">
          You Might Also Love
        </h2>
        <Link to="/shop">
          <Button variant="soft">View All</Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map((i) => <ProductSkeleton key={i} />)
        ) : (
          products.map((product) => (
            <RelatedProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  );
};

export default RelatedProducts;
