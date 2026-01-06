import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background border-border">
        <SheetHeader className="space-y-0 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-2xl text-foreground">
              Your Cart
            </SheetTitle>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
          {itemCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl text-foreground mb-2">
              Your cart is empty
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Add some cozy items to get started
            </p>
            <Button variant="hero" onClick={() => setIsOpen(false)} asChild>
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variant.id}`}
                    className="flex gap-4 p-4 rounded-2xl bg-secondary/30 border border-border"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.productId}`}
                      onClick={() => setIsOpen(false)}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link
                          to={`/product/${item.productId}`}
                          onClick={() => setIsOpen(false)}
                          className="font-medium text-foreground hover:text-lavender-deep transition-colors truncate"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId, item.variant.id)}
                          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: item.variant.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.variant.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="inline-flex items-center rounded-full border border-border bg-card">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variant.id,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-secondary rounded-l-full transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variant.id,
                                item.quantity + 1
                              )
                            }
                            disabled={item.quantity >= 10}
                            className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-secondary rounded-r-full transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-semibold text-foreground">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 space-y-4">
              <Separator />

              {/* Free Shipping Progress */}
              {subtotal < 50 && (
                <div className="p-4 rounded-xl bg-blush-light/50 border border-blush/20">
                  <div className="flex items-center gap-2 text-sm text-plum mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blush to-lavender rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? (
                      <span className="text-lavender-deep">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-lg text-foreground">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <SheetFooter className="flex-col gap-3 sm:flex-col">
                <Button variant="hero" size="xl" className="w-full">
                  Proceed to Checkout
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
