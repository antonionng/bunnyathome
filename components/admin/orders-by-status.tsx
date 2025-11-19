import Link from "next/link";

interface OrdersByStatusProps {
  metrics: {
    pending: number;
    confirmed: number;
    preparing: number;
    shipped: number;
    delivered: number;
    total: number;
  };
}

export function OrdersByStatus({ metrics }: OrdersByStatusProps) {
  const statuses = [
    {
      label: "Pending",
      count: metrics.pending,
      color: "bg-yellow-100 text-yellow-800",
      icon: "⏳",
    },
    {
      label: "Confirmed",
      count: metrics.confirmed,
      color: "bg-blue-100 text-blue-800",
      icon: "✅",
    },
    {
      label: "Preparing",
      count: metrics.preparing,
      color: "bg-purple-100 text-purple-800",
      icon: "👨‍🍳",
    },
    {
      label: "Shipped",
      count: metrics.shipped,
      color: "bg-orange-100 text-orange-800",
      icon: "🚚",
    },
    {
      label: "Delivered",
      count: metrics.delivered,
      color: "bg-green-100 text-green-800",
      icon: "🎉",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Orders by Status</h3>
        <Link
          href="/admin/orders"
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-3">
        {statuses.map((status) => (
          <div
            key={status.label}
            className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{status.icon}</span>
              <div>
                <div className="font-medium text-gray-900">{status.label}</div>
                <div className="text-sm text-gray-500">{status.count} orders</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {metrics.total > 0
                    ? ((status.count / metrics.total) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
              >
                {status.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Total Orders</span>
          <span className="text-2xl font-bold text-gray-900">{metrics.total}</span>
        </div>
      </div>
    </div>
  );
}

