import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Heart, Minus, Plus, ShoppingBag, Sparkles, Truck } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  return (
    <div className="space-y-8 animate-fade-in-up-delay">
      {/* Tag & Category */}
      <div className="flex items-center gap-3">
        {product.tag && (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blush-light text-plum">
            {product.tag}
          </span>
        )}
        <span className="text-sm text-muted-foreground">{product.category}</span>
      </div>

      {/* Title & Rating */}
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-3">
          {product.name}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={cn(
                  "w-5 h-5",
                  star <= Math.round(product.rating)
                    ? "fill-lavender-deep text-lavender-deep"
                    : "fill-muted text-muted"
                )}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-foreground font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-foreground">${product.price}</span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-sage text-accent-foreground">
              Save ${product.originalPrice - product.price}
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">
        {product.longDescription}
      </p>

      {/* Variant Selector */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Color / Scent: <span className="text-lavender-deep">{selectedVariant.name}</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => variant.inStock && setSelectedVariant(variant)}
              disabled={!variant.inStock}
              className={cn(
                "relative w-12 h-12 rounded-full transition-all duration-200",
                "ring-2 ring-offset-2 ring-offset-background",
                !variant.inStock && "opacity-40 cursor-not-allowed",
                selectedVariant.id === variant.id
                  ? "ring-foreground"
                  : "ring-transparent hover:ring-border"
              )}
              style={{ backgroundColor: variant.color }}
              title={variant.name}
            >
              {selectedVariant.id === variant.id && (
                <Check className="absolute inset-0 m-auto w-5 h-5 text-foreground mix-blend-difference" />
              )}
              {!variant.inStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-foreground/50 rotate-45" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Quantity
        </label>
        <div className="inline-flex items-center rounded-full border border-border bg-card">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-secondary rounded-l-full transition-colors disabled:opacity-40"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
            className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-secondary rounded-r-full transition-colors disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="hero" size="xl" className="flex-1">
          <ShoppingBag className="w-5 h-5" />
          Add to Cart — ${product.price * quantity}
        </Button>
        <Button
          variant="glow"
          size="xl"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="px-4"
        >
          <Heart className={cn("w-5 h-5", isWishlisted && "fill-current text-blush")} />
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className="w-4 h-4" />
          Free shipping over $50
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          30-day cozy guarantee
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="font-medium text-foreground">Features</h3>
        <ul className="space-y-2">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-lavender-deep flex-shrink-0 mt-0.5" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductInfo;
