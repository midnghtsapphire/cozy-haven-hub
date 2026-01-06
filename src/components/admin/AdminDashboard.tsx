import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";
import { Loader2, DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const COLORS = ["hsl(var(--lavender-deep))", "hsl(var(--sage))", "hsl(var(--blush))", "hsl(var(--plum))", "#8884d8"];

const AdminDashboard = ({ isAdmin }: AdminDashboardProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalItems = orders.reduce(
      (sum, order) => sum + order.order_items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalItems,
    };
  }, [orders]);

  // Revenue over time (last 30 days)
  const revenueOverTime = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    return last30Days.map((day) => {
      const dayStart = startOfDay(day);
      const dayRevenue = orders
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
  }, [orders]);

  // Orders by status
  const ordersByStatus = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    orders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  }, [orders]);

  // Top products by revenue
  const topProducts = useMemo(() => {
    const productRevenue: Record<string, { name: string; revenue: number; quantity: number }> = {};

    orders.forEach((order) => {
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
  }, [orders]);

  // Revenue by category
  const revenueByCategory = useMemo(() => {
    const categoryRevenue: Record<string, number> = {};

    orders.forEach((order) => {
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
  }, [orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-lavender-deep" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <div className="text-2xl font-bold text-foreground">
              ${metrics.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {metrics.totalOrders} orders
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
            <div className="text-2xl font-bold text-foreground">
              {metrics.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              All time
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
            <div className="text-2xl font-bold text-foreground">
              ${metrics.avgOrderValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per order
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
            <div className="text-2xl font-bold text-foreground">
              {metrics.totalItems}
            </div>
            <p className="text-xs text-muted-foreground">
              Total units
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
