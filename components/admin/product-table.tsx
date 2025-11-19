"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import { useState } from "react";

export function ProductTable() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // TODO: Fetch from API
  const products = [
    {
      id: "bunny-lamb",
      name: "Lamb and Potato Bunny Chow filling",
      category: "Bunny Fillings",
      price: 1295,
      stockLevel: 45,
      lowStockThreshold: 10,
      availability: "in-stock",
      isActive: true,
    },
    {
      id: "bunny-beef",
      name: "Beef Short Rib and Potato Bunny Chow filling",
      category: "Bunny Fillings",
      price: 1295,
      stockLevel: 8,
      lowStockThreshold: 10,
      availability: "limited",
      isActive: true,
    },
    {
      id: "family-chicken",
      name: "Chicken Durban Curry (Meal for 2-3)",
      category: "Family Curries",
      price: 1995,
      stockLevel: 32,
      lowStockThreshold: 15,
      availability: "in-stock",
      isActive: true,
    },
    {
      id: "bread-loaf",
      name: "Soft White Bunny Loaf",
      category: "Breads & Bases",
      price: 495,
      stockLevel: 3,
      lowStockThreshold: 20,
      availability: "out-of-stock",
      isActive: true,
    },
  ];

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { label: "Out", color: "bg-red-100 text-red-800" };
    if (stock <= threshold) return { label: "Low", color: "bg-orange-100 text-orange-800" };
    return { label: "OK", color: "bg-green-100 text-green-800" };
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return "bg-green-100 text-green-800";
      case "limited":
        return "bg-orange-100 text-orange-800";
      case "preorder":
        return "bg-blue-100 text-blue-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="px-6 py-4 bg-orange-50 border-b border-orange-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-orange-900">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-white rounded transition-colors">
                Change Category
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-white rounded transition-colors">
                Update Stock
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-white rounded transition-colors">
                Export Selected
              </button>
              <button className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-white rounded transition-colors">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={toggleAll}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Availability
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stockLevel, product.lowStockThreshold);

              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        🍛
                      </div>
                      <div>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="font-medium text-gray-900 hover:text-orange-600"
                        >
                          {product.name}
                        </Link>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {product.stockLevel}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${stockStatus.color}`}
                      >
                        {stockStatus.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getAvailabilityColor(
                        product.availability
                      )}`}
                    >
                      {product.availability.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Edit
                      </Link>
                      <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                        Duplicate
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">{products.length}</span> of{" "}
          <span className="font-medium">{products.length}</span> products
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium">
            Previous
          </button>
          <button className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-sm font-medium">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

