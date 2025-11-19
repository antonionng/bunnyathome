"use client";

import { useState } from "react";

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    orders: { inApp: true, email: true, sms: false },
    stock: { inApp: true, email: true, sms: true },
    payment: { inApp: true, email: false, sms: false },
    customer: { inApp: true, email: false, sms: false },
  });

  const toggleSetting = (category: keyof typeof settings, channel: "inApp" | "email" | "sms") => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category][channel],
      },
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Notification Settings</h2>
      </div>

      <div className="p-6 space-y-6">
        {Object.entries(settings).map(([category, channels]) => (
          <div key={category}>
            <h3 className="font-medium text-gray-900 capitalize mb-3">{category}</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.inApp}
                  onChange={() => toggleSetting(category as any, "inApp")}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">In-app notifications</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.email}
                  onChange={() => toggleSetting(category as any, "email")}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.sms}
                  onChange={() => toggleSetting(category as any, "sms")}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">SMS notifications</span>
              </label>
            </div>
          </div>
        ))}

        <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
          Save Settings
        </button>
      </div>
    </div>
  );
}

