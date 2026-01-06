import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval, isWithinInterval, differenceInDays } from "date-fns";
import { Loader2, DollarSign, ShoppingCart, TrendingUp, Package, Download, CalendarIcon, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  variant_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  created_at: string;
  order_items: OrderItem[];
}

interface AdminDashboardProps {
  isAdmin: boolean;
}

type DateRange = {
  from: Date;
  to: Date;
};

const COLORS = ["hsl(var(--lavender-deep))", "hsl(var(--sage))", "hsl(var(--blush))", "hsl(var(--plum))", "#8884d8"];

const presetRanges = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "All time", days: 0 },
];

const AdminDashboard = ({ isAdmin }: AdminDashboardProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAdmin) return;

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [isAdmin]);

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return isWithinInterval(orderDate, {
        start: startOfDay(dateRange.from),
        end: endOfDay(dateRange.to),
      });
    });
  }, [orders, dateRange]);

  // Calculate previous period date range
  const previousPeriodRange = useMemo(() => {
    const periodLength = differenceInDays(dateRange.to, dateRange.from) + 1;
    return {
      from: subDays(dateRange.from, periodLength),
      to: subDays(dateRange.from, 1),
    };
  }, [dateRange]);

  // Filter orders for previous period
  const previousPeriodOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return isWithinInterval(orderDate, {
        start: startOfDay(previousPeriodRange.from),
        end: endOfDay(previousPeriodRange.to),
      });
    });
  }, [orders, previousPeriodRange]);

  // Calculate metrics from filtered orders
  const metrics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalItems = filteredOrders.reduce(
      (sum, order) => sum + order.order_items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalItems,
    };
  }, [filteredOrders]);

  // Calculate metrics from previous period orders
  const previousMetrics = useMemo(() => {
    const totalRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = previousPeriodOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalItems = previousPeriodOrders.reduce(
      (sum, order) => sum + order.order_items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalItems,
    };
  }, [previousPeriodOrders]);

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const handlePresetClick = (days: number) => {
    if (days === 0) {
      // All time - use earliest order date or 1 year ago
      const earliestOrder = orders.length > 0 
        ? new Date(orders[0].created_at) 
        : subDays(new Date(), 365);
      setDateRange({
        from: startOfDay(earliestOrder),
        to: new Date(),
      });
    } else {
      setDateRange({
        from: subDays(new Date(), days - 1),
        to: new Date(),
      });
    }
  };

  const changes = useMemo(() => ({
    revenue: calculateChange(metrics.totalRevenue, previousMetrics.totalRevenue),
    orders: calculateChange(metrics.totalOrders, previousMetrics.totalOrders),
    avgOrder: calculateChange(metrics.avgOrderValue, previousMetrics.avgOrderValue),
    items: calculateChange(metrics.totalItems, previousMetrics.totalItems),
  }), [metrics, previousMetrics]);

  // Helper component for change indicator
  const ChangeIndicator = ({ value, showComparison }: { value: number; showComparison: boolean }) => {
    if (!showComparison) return null;
    
    const isPositive = value > 0;
    const isNeutral = value === 0;
    
    return (
      <div className={cn(
        "flex items-center gap-1 text-xs font-medium",
        isNeutral && "text-muted-foreground",
        isPositive && "text-green-600 dark:text-green-400",
        !isPositive && !isNeutral && "text-red-600 dark:text-red-400"
      )}>
        {isNeutral ? (
          <Minus className="w-3 h-3" />
        ) : isPositive ? (
          <ArrowUpRight className="w-3 h-3" />
        ) : (
          <ArrowDownRight className="w-3 h-3" />
        )}
        {Math.abs(value).toFixed(1)}%
      </div>
    );
  };


  // Revenue over time (based on selected date range)
  const revenueOverTime = useMemo(() => {
    const days = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    });

    return days.map((day) => {
      const dayStart = startOfDay(day);
      const dayRevenue = filteredOrders
        .filter((order) => {
          const orderDate = startOfDay(new Date(order.created_at));
          return orderDate.getTime() === dayStart.getTime();
        })
        .reduce((sum, order) => sum + order.total, 0);

      return {
        date: format(day, "MMM d"),
        revenue: dayRevenue,
      };
    });
  }, [filteredOrders, dateRange]);

  // Orders by status (filtered)
  const ordersByStatus = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    filteredOrders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  }, [filteredOrders]);

  // Top products by revenue (filtered)
  const topProducts = useMemo(() => {
    const productRevenue: Record<string, { name: string; revenue: number; quantity: number }> = {};

    filteredOrders.forEach((order) => {
      order.order_items.forEach((item) => {
        if (!productRevenue[item.product_id]) {
          productRevenue[item.product_id] = {
            name: item.product_name,
            revenue: 0,
            quantity: 0,
          };
        }
        productRevenue[item.product_id].revenue += item.price * item.quantity;
        productRevenue[item.product_id].quantity += item.quantity;
      });
    });

    return Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredOrders]);

  // Revenue by category (filtered)
  const revenueByCategory = useMemo(() => {
    const categoryRevenue: Record<string, number> = {};

    filteredOrders.forEach((order) => {
      order.order_items.forEach((item) => {
        const product = products.find((p) => p.id === item.product_id);
        const category = product?.category || "Other";
        categoryRevenue[category] = (categoryRevenue[category] || 0) + item.price * item.quantity;
      });
    });

    return Object.entries(categoryRevenue).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredOrders]);

  // Export functions (use filtered orders)
  const exportOrdersCSV = () => {
    const headers = ["Order ID", "Date", "Status", "Items", "Subtotal", "Shipping", "Total"];
    const rows = filteredOrders.map((order) => [
      order.id,
      format(new Date(order.created_at), "yyyy-MM-dd HH:mm:ss"),
      order.status,
      order.order_items.length,
      order.subtotal.toFixed(2),
      order.shipping.toFixed(2),
      order.total.toFixed(2),
    ]);

    const dateStr = `${format(dateRange.from, "yyyy-MM-dd")}_to_${format(dateRange.to, "yyyy-MM-dd")}`;
    downloadCSV(headers, rows, `orders-${dateStr}.csv`);
  };

  const exportItemsCSV = () => {
    const headers = ["Order ID", "Order Date", "Product", "Variant", "Quantity", "Unit Price", "Line Total"];
    const rows: (string | number)[][] = [];

    filteredOrders.forEach((order) => {
      order.order_items.forEach((item) => {
        rows.push([
          order.id,
          format(new Date(order.created_at), "yyyy-MM-dd"),
          item.product_name,
          item.variant_name,
          item.quantity,
          item.price.toFixed(2),
          (item.price * item.quantity).toFixed(2),
        ]);
      });
    });

    const dateStr = `${format(dateRange.from, "yyyy-MM-dd")}_to_${format(dateRange.to, "yyyy-MM-dd")}`;
    downloadCSV(headers, rows, `order-items-${dateStr}.csv`);
  };

  const exportRevenueCSV = () => {
    const headers = ["Date", "Revenue"];
    const rows = revenueOverTime.map((day) => [day.date, day.revenue.toFixed(2)]);

    downloadCSV(headers, rows, "revenue-by-day.csv");
  };

  const downloadCSV = (headers: string[], rows: (string | number)[][], filename: string) => {
    const escapeCSV = (value: string | number) => {
      const str = String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-lavender-deep" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Filter & Export Actions */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-secondary/30 border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-foreground">Date Range:</span>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {format(dateRange.from, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange((prev) => ({ ...prev, from: date }))}
                    disabled={(date) => date > dateRange.to || date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground">to</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {format(dateRange.to, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange((prev) => ({ ...prev, to: date }))}
                    disabled={(date) => date < dateRange.from || date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-wrap gap-1">
              {presetRanges.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePresetClick(preset.days)}
                  className="text-xs h-7"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="soft" size="sm" onClick={exportOrdersCSV} disabled={filteredOrders.length === 0}>
              <Download className="w-4 h-4" />
              Orders
            </Button>
            <Button variant="soft" size="sm" onClick={exportItemsCSV} disabled={filteredOrders.length === 0}>
              <Download className="w-4 h-4" />
              Items
            </Button>
            <Button variant="soft" size="sm" onClick={exportRevenueCSV} disabled={filteredOrders.length === 0}>
              <Download className="w-4 h-4" />
              Revenue
            </Button>
          </div>
        </div>

        {/* Comparison Toggle and Period Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <Switch
              id="comparison-mode"
              checked={showComparison}
              onCheckedChange={setShowComparison}
            />
            <Label htmlFor="comparison-mode" className="text-sm cursor-pointer">
              Compare with previous period
            </Label>
          </div>
          {showComparison && (
            <div className="text-xs text-muted-foreground">
              Comparing with: {format(previousPeriodRange.from, "MMM d")} - {format(previousPeriodRange.to, "MMM d, yyyy")}
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-lavender-deep" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">
                ${metrics.totalRevenue.toFixed(2)}
              </div>
              <ChangeIndicator value={changes.revenue} showComparison={showComparison} />
            </div>
            <p className="text-xs text-muted-foreground">
              {showComparison ? (
                <>vs ${previousMetrics.totalRevenue.toFixed(2)} prev</>
              ) : (
                <>From {metrics.totalOrders} orders</>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-sage-deep" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">
                {metrics.totalOrders}
              </div>
              <ChangeIndicator value={changes.orders} showComparison={showComparison} />
            </div>
            <p className="text-xs text-muted-foreground">
              {showComparison ? (
                <>vs {previousMetrics.totalOrders} prev</>
              ) : (
                <>In selected period</>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Order Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blush" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">
                ${metrics.avgOrderValue.toFixed(2)}
              </div>
              <ChangeIndicator value={changes.avgOrder} showComparison={showComparison} />
            </div>
            <p className="text-xs text-muted-foreground">
              {showComparison ? (
                <>vs ${previousMetrics.avgOrderValue.toFixed(2)} prev</>
              ) : (
                <>Per order</>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Items Sold
            </CardTitle>
            <Package className="h-4 w-4 text-plum" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">
                {metrics.totalItems}
              </div>
              <ChangeIndicator value={changes.items} showComparison={showComparison} />
            </div>
            <p className="text-xs text-muted-foreground">
              {showComparison ? (
                <>vs {previousMetrics.totalItems} prev</>
              ) : (
                <>Total units</>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Over Time (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueOverTime}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--lavender-deep))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--lavender-deep))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--lavender-deep))"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      type="number"
                      className="text-xs fill-muted-foreground"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      className="text-xs fill-muted-foreground"
                      tick={{ fontSize: 12 }}
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === "revenue") return [`$${value.toFixed(2)}`, "Revenue"];
                        return [value, "Quantity"];
                      }}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--lavender-deep))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No product data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersByStatus.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ordersByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {ordersByStatus.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-muted-foreground">
                        {entry.name} ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No order data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueByCategory.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {revenueByCategory.map((category, index) => (
                <div
                  key={category.name}
                  className="p-4 rounded-xl border border-border bg-secondary/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-foreground">{category.name}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    ${category.value.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No category data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
