import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import FeaturesSection from "@/components/FeaturesSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <EmailVerificationBanner />
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <FeaturesSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
