"use client";

import { useState } from "react";

interface Product {
  id: string;
  name: string;
  stock: number;
  threshold: number;
  status: "ok" | "low" | "out";
}

interface InventoryAdjusterProps {
  products: Product[];
}

export function InventoryAdjuster({ products: initialProducts }: InventoryAdjusterProps) {
  const [products, setProducts] = useState(initialProducts);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState("");

  const handleAdjust = (productId: string) => {
    const amount = parseInt(adjustmentAmount);
    if (isNaN(amount)) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, stock: Math.max(0, p.stock + amount) }
          : p
      )
    );

    setAdjusting(null);
    setAdjustmentAmount("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "bg-green-100 text-green-800";
      case "low":
        return "bg-orange-100 text-orange-800";
      case "out":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Current Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Threshold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.threshold}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {adjusting === product.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="number"
                        value={adjustmentAmount}
                        onChange={(e) => setAdjustmentAmount(e.target.value)}
                        placeholder="+/- amount"
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAdjust(product.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setAdjusting(null);
                          setAdjustmentAmount("");
                        }}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAdjusting(product.id)}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Adjust Stock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

