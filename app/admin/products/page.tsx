import Link from "next/link";
import { ProductTable } from "@/components/admin/product-table";

export const metadata = {
  title: "Products | Admin | Bunny At Home",
};

export default async function ProductsPage() {
  // TODO: Fetch products from API
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog and inventory
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">All Categories</option>
            <option value="bunnyFillings">Bunny Fillings</option>
            <option value="familyCurries">Family Curries</option>
            <option value="sides">Sides</option>
            <option value="sauces">Sauces & Extras</option>
            <option value="drinks">Drinks</option>
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">All Availability</option>
            <option value="in-stock">In Stock</option>
            <option value="limited">Limited</option>
            <option value="preorder">Pre-order</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">Stock Level</option>
            <option value="low">Low Stock</option>
            <option value="normal">Normal</option>
            <option value="high">High Stock</option>
          </select>

          <div className="flex-1" />

          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Export CSV
          </button>

          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Import CSV
          </button>
        </div>
      </div>

      {/* Products Table */}
      <ProductTable />
    </div>
  );
}

