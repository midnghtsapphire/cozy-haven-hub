import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, Search, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import SearchDialog from "@/components/SearchDialog";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount, setIsOpen } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="font-serif text-2xl font-medium text-foreground">
              duskglow
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                to="/shop" 
                className={cn(
                  "text-sm transition-colors",
                  isActive("/shop") ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Shop
              </Link>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Collections
              </a>
              <Link 
                to="/quiz" 
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive("/quiz") ? "text-foreground" : "text-lavender-deep hover:text-foreground"
                )}
              >
                ✨ Sanctuary Quiz
              </Link>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors group relative"
              >
                <Search className="w-5 h-5 text-foreground" />
                <span className="hidden lg:flex absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ⌘K
                </span>
              </button>
              <button className="hidden md:flex w-10 h-10 rounded-full items-center justify-center hover:bg-secondary transition-colors">
                <User className="w-5 h-5 text-foreground" />
              </button>
              <Button 
                variant="soft" 
                size="sm" 
                className="gap-2"
                onClick={() => setIsOpen(true)}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="w-5 h-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              </Button>
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-4">
                {/* Mobile Search */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  <Search className="w-4 h-4" />
                  Search products
                </button>
                <Link 
                  to="/shop" 
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-sm transition-colors py-2",
                    isActive("/shop") ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Shop
                </Link>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                  Collections
                </a>
                <Link 
                  to="/quiz" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm text-lavender-deep font-medium hover:text-foreground transition-colors py-2"
                >
                  ✨ Sanctuary Quiz
                </Link>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                  About
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
};

export default Navbar;
