import Link from "next/link";

export function LowStockAlert() {
  // TODO: Fetch real low stock items from API
  const lowStockItems = [
    {
      id: "bunny-lamb",
      name: "Lamb Bunny Chow",
      currentStock: 5,
      threshold: 10,
      severity: "critical" as const,
    },
    {
      id: "family-beef",
      name: "Beef Short Rib Curry",
      currentStock: 8,
      threshold: 15,
      severity: "warning" as const,
    },
    {
      id: "bread-loaf",
      name: "Soft White Bunny Loaf",
      currentStock: 12,
      threshold: 20,
      severity: "warning" as const,
    },
    {
      id: "extra-samoosa",
      name: "Samoosas (12)",
      currentStock: 3,
      threshold: 10,
      severity: "critical" as const,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
        </div>
        <Link
          href="/admin/inventory"
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          View Inventory →
        </Link>
      </div>

      <div className="space-y-3">
        {lowStockItems.map((item) => (
          <Link
            key={item.id}
            href={`/admin/products/${item.id}`}
            className={`block p-4 rounded-lg border transition-colors hover:shadow-sm ${getSeverityColor(
              item.severity
            )}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{item.name}</div>
              <span className="text-sm font-bold">{item.currentStock} units</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    item.severity === "critical" ? "bg-red-500" : "bg-orange-500"
                  }`}
                  style={{
                    width: `${Math.min((item.currentStock / item.threshold) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-600">
                Min: {item.threshold}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="w-full py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
          Reorder All Low Stock Items
        </button>
      </div>
    </div>
  );
}

