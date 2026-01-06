import { Instagram, Twitter, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 bg-card border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl font-medium text-foreground mb-4">
              duskglow
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Creating sanctuaries for the dreamers, studyers, and night owls who deserve softness.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-blush-light transition-colors"
              >
                <Instagram className="w-5 h-5 text-foreground" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-blush-light transition-colors"
              >
                <Twitter className="w-5 h-5 text-foreground" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Lighting</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Scents</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Comfort Items</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Help</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Vibes</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Desk Inspo</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Sanctuary Quiz</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 duskglow. Made with <Heart className="w-4 h-4 inline text-blush" /> for night owls everywhere.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
