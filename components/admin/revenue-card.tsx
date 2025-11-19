import { formatPrice } from "@/lib/currency";

interface RevenueCardProps {
  title: string;
  amount: number; // in cents
  change: number; // percentage change
  icon: string;
}

export function RevenueCard({ title, amount, change, icon }: RevenueCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-600">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">
          {formatPrice(amount)}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500">vs last period</span>
        </div>
      </div>
    </div>
  );
}

