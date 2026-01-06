import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import { products, getProductById } from "@/data/products";
import { ArrowLeft } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "1");

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 text-center">
          <h1 className="text-2xl font-serif text-foreground">Product not found</h1>
          <Link to="/" className="text-lavender-deep hover:underline mt-4 inline-block">
            Go back home
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
              to="/"
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
          <ProductReviews reviews={product.reviews} rating={product.rating} reviewCount={product.reviewCount} />

          {/* Related Products */}
          <RelatedProducts currentProductId={product.id} products={products} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
