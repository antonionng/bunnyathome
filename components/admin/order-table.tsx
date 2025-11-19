"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import { StatusChanger } from "./status-changer";

export function OrderTable() {
  const [orders] = useState([
    {
      id: "1",
      orderNumber: "BH-123456789",
      customer: "Sarah Johnson",
      status: "pending",
      total: 3450,
      items: 4,
      date: new Date().toISOString(),
    },
    {
      id: "2",
      orderNumber: "BH-987654321",
      customer: "Michael Smith",
      status: "confirmed",
      total: 2195,
      items: 3,
      date: new Date().toISOString(),
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
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
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total
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
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-sm font-medium text-orange-600 hover:text-orange-700"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatPrice(order.total)}
                </td>
                <td className="px-6 py-4">
                  <StatusChanger currentStatus={order.status} orderId={order.id} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View Details
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

