import { RevenueCard } from "@/components/admin/revenue-card";
import { OrdersByStatus } from "@/components/admin/orders-by-status";
import { LowStockAlert } from "@/components/admin/low-stock-alert";
import { RecentActivityFeed } from "@/components/admin/recent-activity-feed";

export const metadata = {
  title: "Admin Dashboard | Bunny At Home",
  description: "Manage your Bunny At Home business",
};

export default async function AdminDashboard() {
  // TODO: Fetch real data from API
  const mockMetrics = {
    revenue: {
      today: 25430,
      week: 125670,
      month: 532100,
      year: 2450000,
    },
    orders: {
      pending: 5,
      confirmed: 12,
      preparing: 8,
      shipped: 15,
      delivered: 156,
      total: 196,
    },
    customers: {
      total: 342,
      new: 23,
      active: 145,
    },
    inventory: {
      lowStock: 7,
      outOfStock: 2,
      totalProducts: 45,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RevenueCard
          title="Today"
          amount={mockMetrics.revenue.today}
          change={+12.5}
          icon="💰"
        />
        <RevenueCard
          title="This Week"
          amount={mockMetrics.revenue.week}
          change={+8.3}
          icon="📊"
        />
        <RevenueCard
          title="This Month"
          amount={mockMetrics.revenue.month}
          change={+15.2}
          icon="📈"
        />
        <RevenueCard
          title="This Year"
          amount={mockMetrics.revenue.year}
          change={+22.4}
          icon="🎯"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Orders Today</h3>
            <span className="text-2xl">🛍️</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {mockMetrics.orders.pending + mockMetrics.orders.confirmed}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {mockMetrics.orders.pending} pending fulfillment
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Customers</h3>
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {mockMetrics.customers.active}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {mockMetrics.customers.new} new this week
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Inventory</h3>
            <span className="text-2xl">📦</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {mockMetrics.inventory.totalProducts}
          </div>
          <p className="text-sm text-red-600 mt-1">
            {mockMetrics.inventory.lowStock} items low stock
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders by Status - Takes 2 columns */}
        <div className="lg:col-span-2">
          <OrdersByStatus metrics={mockMetrics.orders} />
        </div>

        {/* Low Stock Alerts */}
        <div>
          <LowStockAlert />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivityFeed />
    </div>
  );
}

