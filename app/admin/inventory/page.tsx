import { InventoryAdjuster } from "@/components/admin/inventory-adjuster";

export const metadata = {
  title: "Inventory | Admin | Bunny At Home",
};

export default async function InventoryPage() {
  // TODO: Fetch from API
  const mockInventory = [
    { id: "bunny-lamb", name: "Lamb Bunny Chow", stock: 45, threshold: 10, status: "ok" },
    { id: "bunny-beef", name: "Beef Bunny Chow", stock: 8, threshold: 10, status: "low" },
    { id: "bread-loaf", name: "Bunny Loaf", stock: 0, threshold: 20, status: "out" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track stock levels and manage reorders</p>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
          Import Stock Data
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl mb-2">📦</div>
          <div className="text-2xl font-bold text-gray-900">45</div>
          <div className="text-sm text-gray-600">Total Products</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">32</div>
          <div className="text-sm text-gray-600">In Stock</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-2xl font-bold text-orange-600">7</div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl mb-2">❌</div>
          <div className="text-2xl font-bold text-red-600">6</div>
          <div className="text-sm text-gray-600">Out of Stock</div>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryAdjuster products={mockInventory} />
    </div>
  );
}

