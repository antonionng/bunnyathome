"use client";

import { useState } from "react";

export function NotificationList() {
  const [notifications] = useState([
    {
      id: "1",
      type: "order",
      priority: "high",
      title: "New Order Received",
      message: "Order #BH-123456789 needs fulfillment",
      isRead: false,
      createdAt: new Date(),
    },
    {
      id: "2",
      type: "stock",
      priority: "critical",
      title: "Low Stock Alert",
      message: "Lamb Durban Curry is running low (5 units)",
      isRead: false,
      createdAt: new Date(),
    },
    {
      id: "3",
      type: "payment",
      priority: "medium",
      title: "Payment Received",
      message: "R254.30 payment confirmed for order #BH-987654321",
      isRead: true,
      createdAt: new Date(),
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return "🛍️";
      case "stock":
        return "📦";
      case "payment":
        return "💳";
      case "customer":
        return "👤";
      default:
        return "🔔";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">All Notifications</h2>
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
          Mark all as read
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-6 py-4 hover:bg-gray-50 cursor-pointer ${
              !notification.isRead ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getIcon(notification.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {notification.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(
                      notification.priority
                    )}`}
                  >
                    {notification.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <div className="text-xs text-gray-400 mt-1">Just now</div>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

