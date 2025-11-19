import { CustomerTable } from "@/components/admin/customer-table";

export const metadata = {
  title: "Customers | Admin | Bunny At Home",
};

export default async function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">View and manage customer accounts</p>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
          Export Customer Data
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <input
          type="search"
          placeholder="Search customers by name, email, or order number..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Customer Table */}
      <CustomerTable />
    </div>
  );
}

