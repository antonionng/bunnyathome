import Link from "next/link";
import { BoxCard } from "@/components/admin/box-card";

export const metadata = {
  title: "Ready Boxes | Admin | Bunny At Home",
};

export default async function ReadyBoxesPage() {
  // TODO: Fetch boxes from API
  const mockBoxes = [
    {
      id: "1",
      name: "Valentine's Love Birds",
      theme: "valentines",
      boxType: "occasion" as const,
      isPublished: true,
      totalPrice: 3950,
      currentSales: 45,
      imageUrl: "/boxes/valentines-placeholder.png",
    },
    {
      id: "2",
      name: "Heritage Day Feast",
      theme: "heritage-month",
      boxType: "occasion" as const,
      isPublished: true,
      totalPrice: 4250,
      currentSales: 32,
      imageUrl: "/boxes/heritage-placeholder.png",
    },
    {
      id: "3",
      name: "Winter Warmers Special",
      theme: "winter",
      boxType: "seasonal" as const,
      isPublished: false,
      totalPrice: 3750,
      currentSales: 0,
      imageUrl: "/boxes/winter-placeholder.png",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ready Boxes</h1>
          <p className="text-gray-600 mt-1">
            Curated box combinations for seasonal and special occasions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/boxes/generate"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-600 text-white rounded-lg hover:from-purple-700 hover:to-orange-700 transition-colors font-medium inline-flex items-center gap-2"
          >
            ✨ Generate with AI
          </Link>
          <Link
            href="/admin/boxes/new"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Manually
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button className="px-6 py-3 font-medium text-orange-600 border-b-2 border-orange-600">
            All Boxes
          </button>
          <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900">
            Published
          </button>
          <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900">
            Drafts
          </button>
          <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900">
            Seasonal
          </button>
          <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900">
            Occasions
          </button>
        </div>
      </div>

      {/* Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBoxes.map((box) => (
          <BoxCard key={box.id} box={box} />
        ))}
      </div>

      {/* Empty State (when no boxes) */}
      {mockBoxes.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No boxes yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first themed box or let AI generate suggestions for you
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/admin/boxes/generate"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 text-white rounded-lg hover:from-purple-700 hover:to-orange-700 transition-colors font-medium inline-flex items-center gap-2"
            >
              ✨ Generate with AI
            </Link>
            <Link
              href="/admin/boxes/new"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Create Manually
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

