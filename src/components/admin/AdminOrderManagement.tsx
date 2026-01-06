import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, Package, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_name: string;
  quantity: number;
  price: number;
  image_url: string | null;
}

interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  created_at: string;
  updated_at: string;
  shipping_address: Record<string, string> | null;
  order_items: OrderItem[];
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200",
  delivered: "bg-sage/30 text-sage-deep",
  cancelled: "bg-destructive/10 text-destructive",
};

interface AdminOrderManagementProps {
  isAdmin: boolean;
}

const AdminOrderManagement = ({ isAdmin }: AdminOrderManagementProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAdmin) return;

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [isAdmin]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
    } else {
      toast.success(`Order status updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }

    setUpdating(null);
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-16 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No orders found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Items</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <>
            <TableRow key={order.id} className="cursor-pointer" onClick={() => toggleExpand(order.id)}>
              <TableCell>
                <button className="p-1">
                  {expandedOrder === order.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {order.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                {format(new Date(order.created_at), "MMM d, yyyy")}
                <span className="block text-xs text-muted-foreground">
                  {format(new Date(order.created_at), "h:mm a")}
                </span>
              </TableCell>
              <TableCell>
                {order.order_items.length} item{order.order_items.length !== 1 ? "s" : ""}
              </TableCell>
              <TableCell className="text-right font-medium">
                ${order.total.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                <Badge className={cn("font-medium", statusColors[order.status])}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                  disabled={updating === order.id}
                >
                  <SelectTrigger className="w-[140px]">
                    {updating === order.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <SelectValue />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
            {expandedOrder === order.id && (
              <TableRow key={`${order.id}-details`}>
                <TableCell colSpan={7} className="bg-secondary/30 p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Order Items</h4>
                    <div className="grid gap-2">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border"
                        >
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.product_name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <Link
                              to={`/product/${item.product_id}`}
                              className="font-medium text-foreground hover:text-lavender-deep transition-colors inline-flex items-center gap-1"
                            >
                              {item.product_name}
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {item.variant_name} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between pt-4 border-t border-border text-sm">
                      <div>
                        <p className="text-muted-foreground">Subtotal: ${order.subtotal.toFixed(2)}</p>
                        <p className="text-muted-foreground">Shipping: ${order.shipping.toFixed(2)}</p>
                      </div>
                      <p className="font-semibold text-foreground">Total: ${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminOrderManagement;
