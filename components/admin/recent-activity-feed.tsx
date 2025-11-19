export function RecentActivityFeed() {
  // TODO: Fetch real activity data from API
  const activities = [
    {
      id: "1",
      type: "order",
      icon: "🛍️",
      message: "New order #BH-123456789 received",
      user: "Sarah Johnson",
      time: "2 minutes ago",
      color: "text-blue-600",
    },
    {
      id: "2",
      type: "product",
      icon: "🍛",
      message: "Product updated: Lamb Bunny Chow",
      user: "Admin",
      time: "15 minutes ago",
      color: "text-purple-600",
    },
    {
      id: "3",
      type: "stock",
      icon: "📦",
      message: "Stock replenished: Soft White Bunny Loaf (+50 units)",
      user: "Operations",
      time: "1 hour ago",
      color: "text-green-600",
    },
    {
      id: "4",
      type: "order",
      icon: "🚚",
      message: "Order #BH-987654321 shipped",
      user: "Michael Smith",
      time: "2 hours ago",
      color: "text-orange-600",
    },
    {
      id: "5",
      type: "customer",
      icon: "👤",
      message: "New customer registered: Emma Wilson",
      user: "System",
      time: "3 hours ago",
      color: "text-indigo-600",
    },
    {
      id: "6",
      type: "payment",
      icon: "💳",
      message: "Payment received: R254.30",
      user: "John Doe",
      time: "4 hours ago",
      color: "text-green-600",
    },
    {
      id: "7",
      type: "review",
      icon: "⭐",
      message: "New 5-star review for Chicken Bunny Chow",
      user: "Lisa Brown",
      time: "5 hours ago",
      color: "text-yellow-600",
    },
    {
      id: "8",
      type: "order",
      icon: "✅",
      message: "Order #BH-456789123 confirmed",
      user: "David Lee",
      time: "6 hours ago",
      color: "text-blue-600",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
          View All →
        </button>
      </div>

      <div className="space-y-1">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
              index !== activities.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                {activity.icon}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium ${activity.color}`}>
                  {activity.user}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>

            <button className="flex-shrink-0 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
          Load More Activity
        </button>
      </div>
    </div>
  );
}

