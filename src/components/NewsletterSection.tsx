import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const NewsletterSection = () => {
  return (
    <section className="py-24 gradient-hero relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="glow-blob w-72 h-72 bg-blush/30 -top-20 -right-20" />
      <div className="glow-blob w-56 h-56 bg-lavender/20 bottom-0 left-10" style={{ animationDelay: "3s" }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-sm font-medium text-lavender-deep tracking-wider uppercase">
            Join the Sanctuary
          </span>
          
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-medium text-foreground">
            Soft drops, cozy vibes
          </h2>
          
          <p className="mt-4 text-muted-foreground">
            Be the first to know about new products, exclusive deals, and sanctuary inspo.
            Plus, get 15% off your first order.
          </p>

          <form className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="your@email.com"
                className="h-14 px-6 rounded-full bg-card border-border focus:border-blush text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="hero" size="xl" type="submit">
              <Send className="w-4 h-4" />
              Subscribe
            </Button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground">
            No spam, ever. Just soft things. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
