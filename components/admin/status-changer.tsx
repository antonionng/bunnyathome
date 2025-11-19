"use client";

import { useState } from "react";

interface StatusChangerProps {
  currentStatus: string;
  orderId: string;
}

export function StatusChanger({ currentStatus, orderId }: StatusChangerProps) {
  const [status, setStatus] = useState(currentStatus);

  const handleChange = async (newStatus: string) => {
    // TODO: API call to update status
    setStatus(newStatus);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
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
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 ${getStatusColor(
        status
      )}`}
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="preparing">Preparing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
    </select>
  );
}

