import Link from "next/link";
import { formatPrice } from "@/lib/currency";

interface BoxCardProps {
  box: {
    id: string;
    name: string;
    theme?: string;
    boxType: "seasonal" | "occasion" | "curated" | "bundle";
    isPublished: boolean;
    totalPrice: number;
    currentSales: number;
    imageUrl?: string;
  };
}

export function BoxCard({ box }: BoxCardProps) {
  const getThemeEmoji = (theme?: string) => {
    const themes: Record<string, string> = {
      valentines: "💝",
      halloween: "🎃",
      "heritage-month": "🇿🇦",
      christmas: "🎄",
      "fathers-day": "👔",
      "mothers-day": "🌸",
      winter: "❄️",
      summer: "☀️",
      spring: "🌺",
      autumn: "🍂",
    };
    return themes[theme || ""] || "📦";
  };

  return (
    <Link
      href={`/admin/boxes/${box.id}`}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] bg-gray-100 relative">
        {box.imageUrl ? (
          <img src={box.imageUrl} alt={box.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {getThemeEmoji(box.theme)}
          </div>
        )}
        {!box.isPublished && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-gray-900 bg-opacity-75 text-white text-xs font-medium rounded">
            Draft
          </div>
        )}
        {box.isPublished && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded">
            Published
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{box.name}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          {box.theme && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded capitalize">
              {box.theme.replace("-", " ")}
            </span>
          )}
          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded capitalize">
            {box.boxType}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(box.totalPrice)}
            </div>
            <div className="text-xs text-gray-500">
              {box.currentSales} sold
            </div>
          </div>

          <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors">
            Edit
          </button>
        </div>
      </div>
    </Link>
  );
}

