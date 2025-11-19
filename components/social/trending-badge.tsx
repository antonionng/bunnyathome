export function TrendingBadge() {
  return (
    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
      <span className="animate-pulse">🔥</span>
      <span>Trending</span>
    </div>
  );
}

