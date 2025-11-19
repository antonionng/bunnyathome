import { NotificationList } from "@/components/admin/notification-list";
import { NotificationSettings } from "@/components/admin/notification-settings";

export const metadata = {
  title: "Notifications | Admin | Bunny At Home",
};

export default async function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">
          Manage alerts and notification preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List - Takes 2 columns */}
        <div className="lg:col-span-2">
          <NotificationList />
        </div>

        {/* Notification Settings */}
        <div>
          <NotificationSettings />
        </div>
      </div>
    </div>
  );
}

