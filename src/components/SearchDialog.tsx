import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import { Clock, Search, Star, TrendingUp, X } from "lucide-react";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RECENT_SEARCHES_KEY = "duskglow-recent-searches";
const MAX_RECENT_SEARCHES = 5;

const popularSearches = ["lamp", "candle", "organizer", "comfort", "lavender"];

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, [open]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!open) {
      setQuery("");
      setSelectedIndex(-1);
    }
  }, [open]);

  // Filter products based on query
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
  }, [query]);

  const saveRecentSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s !== trimmed),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    saveRecentSearch(searchTerm);
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    onOpenChange(false);
  };

  const handleProductClick = (productId: string) => {
    if (query.trim()) saveRecentSearch(query);
    navigate(`/product/${productId}`);
    onOpenChange(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = suggestions.length || (query ? 0 : recentSearches.length + popularSearches.length);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, totalItems - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0 && selectedIndex >= 0) {
        handleProductClick(suggestions[selectedIndex].id);
      } else if (!query && selectedIndex >= 0) {
        const allQuickItems = [...recentSearches, ...popularSearches];
        if (selectedIndex < allQuickItems.length) {
          handleSearch(allQuickItems[selectedIndex]);
        }
      } else {
        handleSearch(query);
      }
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 bg-card border-border overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            className="border-0 p-0 h-auto text-lg placeholder:text-muted-foreground focus-visible:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() ? (
            // Product Suggestions
            suggestions.length > 0 ? (
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Products
                </p>
                {suggestions.map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-3 rounded-xl text-left transition-colors",
                      selectedIndex === index ? "bg-blush-light" : "hover:bg-secondary"
                    )}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-3 h-3 fill-lavender-deep text-lavender-deep" />
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                        <span className="text-sm font-medium text-foreground">${product.price}</span>
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* View All Results */}
                <button
                  onClick={() => handleSearch(query)}
                  className="w-full p-3 mt-2 text-center text-sm font-medium text-lavender-deep hover:bg-secondary rounded-xl transition-colors"
                >
                  View all results for "{query}"
                </button>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No products found for "{query}"</p>
                <button
                  onClick={() => handleSearch(query)}
                  className="mt-2 text-sm font-medium text-lavender-deep hover:underline"
                >
                  Search anyway
                </button>
              </div>
            )
          ) : (
            // Recent & Popular Searches
            <div className="p-2">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Recent Searches
                    </p>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors",
                        selectedIndex === index ? "bg-blush-light" : "hover:bg-secondary"
                      )}
                    >
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              <div>
                <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Popular Searches
                </p>
                {popularSearches.map((search, index) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors",
                      selectedIndex === recentSearches.length + index ? "bg-blush-light" : "hover:bg-secondary"
                    )}
                  >
                    <TrendingUp className="w-4 h-4 text-lavender-deep" />
                    <span className="text-foreground">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 border-t border-border bg-secondary/30">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">↑↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">Enter</kbd>
              to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">Esc</kbd>
              to close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
