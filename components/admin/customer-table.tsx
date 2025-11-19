"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/currency";

export function CustomerTable() {
  const customers = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      orders: 12,
      totalSpend: 18450,
      loyaltyTier: "Gold",
      lastOrder: "2 days ago",
    },
    {
      id: "2",
      name: "Michael Smith",
      email: "michael@example.com",
      orders: 5,
      totalSpend: 7200,
      loyaltyTier: "Silver",
      lastOrder: "1 week ago",
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-purple-100 text-purple-800";
      case "Gold":
        return "bg-yellow-100 text-yellow-800";
      case "Silver":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Spend
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Last Order
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{customer.orders}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatPrice(customer.totalSpend)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTierColor(
                      customer.loyaltyTier
                    )}`}
                  >
                    {customer.loyaltyTier}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {customer.lastOrder}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

