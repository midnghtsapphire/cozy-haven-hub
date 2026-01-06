import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import { useProduct } from "@/hooks/useProducts";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
    <Skeleton className="aspect-square rounded-3xl" />
    <div className="space-y-6">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-12 h-12 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-14 w-full rounded-full" />
    </div>
  </div>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <nav className="mb-8">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
              </Link>
            </nav>
            <ProductDetailSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 text-center">
          <h1 className="text-2xl font-serif text-foreground">Product not found</h1>
          <Link to="/shop" className="text-lavender-deep hover:underline mt-4 inline-block">
            Go back to shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 animate-fade-in-up">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Link>
          </nav>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
            <ProductGallery images={product.images} productName={product.name} />
            <ProductInfo product={product} />
          </div>

          {/* Reviews Section */}
          <ProductReviews productId={product.id} />

          {/* Related Products */}
          <RelatedProducts currentProductId={product.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
