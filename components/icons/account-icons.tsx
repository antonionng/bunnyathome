// Simple icon components to replace emojis in account section
// Using SVG paths for clean, scalable icons

export function HomeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function PackageIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

export function StarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function MapPinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function RefreshIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export function GiftIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

export function SettingsIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6m0-12a9 9 0 0 1 9 9m-9-9a9 9 0 0 0-9 9m9 3a9 9 0 0 1-9-9m9 9a9 9 0 0 0 9-9" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function ShoppingCartIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

export function UsersIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function MessageSquareIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function CakeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <path d="M2 21h20" />
      <path d="M7 8v3" />
      <path d="M12 8v3" />
      <path d="M17 8v3" />
      <path d="M7 4h.01" />
      <path d="M12 4h.01" />
      <path d="M17 4h.01" />
    </svg>
  );
}

// Empty state illustration components
export function EmptyBoxIllustration({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <div className={`${className} mx-auto relative`}>
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
        <rect x="20" y="28" width="56" height="48" rx="2" stroke="currentColor" strokeWidth="2.5" className="text-brand-curry" fill="none" />
        <path d="M20 44 L48 56 L76 44" stroke="currentColor" strokeWidth="2.5" className="text-brand-coral" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="48" y1="56" x2="48" y2="76" stroke="currentColor" strokeWidth="2.5" className="text-brand-coral" strokeLinecap="round" />
        <path d="M20 28 L48 40 L76 28" stroke="currentColor" strokeWidth="2.5" className="text-brand-curry" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="48" cy="40" r="3" fill="currentColor" className="text-brand-black" />
      </svg>
    </div>
  );
}

export function EmptySearchIllustration({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <div className={`${className} mx-auto relative`}>
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
        <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="2.5" className="text-brand-blue" fill="none" />
        <line x1="55" y1="55" x2="70" y2="70" stroke="currentColor" strokeWidth="2.5" className="text-brand-blue" strokeLinecap="round" />
        <path d="M30 40 Q30 30 40 30" stroke="currentColor" strokeWidth="2" className="text-brand-coral opacity-50" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function EmptyLocationIllustration({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <div className={`${className} mx-auto relative`}>
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
        <path d="M48 20 C35 20 25 30 25 43 C25 55 48 76 48 76 C48 76 71 55 71 43 C71 30 61 20 48 20 Z" stroke="currentColor" strokeWidth="2.5" className="text-brand-green" fill="none" />
        <circle cx="48" cy="43" r="8" fill="currentColor" className="text-brand-curry" />
      </svg>
    </div>
  );
}

export function EmptySubscriptionIllustration({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <div className={`${className} mx-auto relative`}>
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
        <circle cx="48" cy="48" r="25" stroke="currentColor" strokeWidth="2.5" className="text-brand-pink" fill="none" />
        <path d="M48 30 L48 48 L60 54" stroke="currentColor" strokeWidth="2.5" className="text-brand-coral" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M68 40 L75 35 L70 28" stroke="currentColor" strokeWidth="2" className="text-brand-pink" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}



