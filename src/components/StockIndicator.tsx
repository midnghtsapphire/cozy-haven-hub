import { cn } from "@/lib/utils";
import type { StockStatus } from "@/hooks/useInventory";
import { Package, AlertTriangle, XCircle } from "lucide-react";

interface StockIndicatorProps {
  status: StockStatus;
  quantity?: number | null;
  showQuantity?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const StockIndicator = ({ 
  status, 
  quantity, 
  showQuantity = false, 
  size = "md",
  className 
}: StockIndicatorProps) => {
  const config = {
    in_stock: {
      label: "In Stock",
      icon: Package,
      className: "text-sage-deep bg-sage/20",
    },
    low_stock: {
      label: quantity && showQuantity ? `Only ${quantity} left` : "Low Stock",
      icon: AlertTriangle,
      className: "text-amber-600 bg-amber-100 dark:bg-amber-900/20",
    },
    out_of_stock: {
      label: "Out of Stock",
      icon: XCircle,
      className: "text-destructive bg-destructive/10",
    },
  };

  const { label, icon: Icon, className: statusClassName } = config[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        statusClassName,
        className
      )}
    >
      <Icon className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
      <span>{label}</span>
    </div>
  );
};

export default StockIndicator;
