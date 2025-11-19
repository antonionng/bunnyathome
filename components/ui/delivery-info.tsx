import { cn } from "@/lib/utils";

interface DeliveryInfoProps {
  variant?: "default" | "compact";
  className?: string;
}

const DELIVERY_POINTS = [
  { icon: "🔥", text: "Orders lock every Tuesday at 6pm for the weekend drop." },
  { icon: "🚚", text: "Deliveries land by Friday braai-time nationwide." },
  { icon: "💸", text: "Flat £5 delivery under £50 · free once your cart crosses it." },
];

export function DeliveryInfo({ variant = "default", className }: DeliveryInfoProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-dashed border-brand-coral bg-brand-coral/10 p-4 text-sm text-ink",
        isCompact && "text-xs p-3",
        className
      )}
    >
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-coral">
        Delivery intel
      </p>
      <ul className="mt-3 space-y-1">
        {DELIVERY_POINTS.map((point) => (
          <li key={point.text} className="flex items-start gap-2">
            <span aria-hidden className="text-base leading-none">
              {point.icon}
            </span>
            <span>{point.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

