"use client";

import { Button } from "@/components/ui/button";
import { formatFromPence } from "@/lib/currency";
import type {
  BuilderCatalog,
  BuilderSelection,
  BuilderStep,
  CalculatedTotals,
} from "@/types/builder";

interface SummaryPanelProps {
  step: BuilderStep;
  selection: BuilderSelection;
  catalog: BuilderCatalog;
  totals: CalculatedTotals;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  canProceed: boolean;
}

export function SummaryPanel({
  step,
  selection,
  catalog,
  totals,
  onNext,
  onPrev,
  onReset,
  canProceed,
}: SummaryPanelProps) {
  const selectedCurry = selection.curryId
    ? catalog.curries.find((curry) => curry.id === selection.curryId)
    : null;

  const listForCategory = (
    category: "sides" | "sauces" | "drinks",
    label: string
  ) => {
    const entries = Object.entries(selection[category]);
    if (entries.length === 0) {
      return null;
    }

    return (
      <div key={category} className="space-y-3 rounded-lg border-2 border-black bg-white p-5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
          <span>{label}</span>
          <span>{entries.length} selected</span>
        </div>
        <ul className="space-y-2 text-sm text-ink">
          {entries.map(([id, quantity]) => {
            const product = catalog[category].find((item) => item.id === id);
            if (!product) {
              return null;
            }
            return (
              <li key={id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p className="text-xs text-ink-muted">Qty {quantity}</p>
                </div>
                <span className="text-sm font-bold text-brand-curry">
                  {formatFromPence(product.price * quantity)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderPrimaryLabel = () => {
    if (step === "summary") {
      return "Save box (coming soon)";
    }
    if (!selection.curryId) {
      return "Pick a curry to continue";
    }
    return "Continue";
  };

  return (
    <aside className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg flex h-fit flex-col gap-6 section-border-pink">
      <div className="space-y-2">
        <span className="tag-pill bg-brand-pink text-brand-black">Your box</span>
        <h3 className="text-xl font-bold text-ink">Durban night in</h3>
        <p className="text-sm text-ink-muted">
          Keep tweaking flavour, spice, and pairings. We'll save this box to your profile soon.
        </p>
      </div>

      <div className="space-y-3 rounded-lg border-2 border-black bg-brand-curry p-5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-brand-black">
          <span>Bunny filling</span>
          <span>Spice · {selection.currySpiceLevel}</span>
        </div>
        {selectedCurry ? (
          <div className="space-y-2">
            <p className="text-lg font-bold text-brand-black">{selectedCurry.name}</p>
            <p className="text-sm text-brand-black/80">{selectedCurry.description}</p>
            <span className="text-sm font-bold text-brand-black">
              {formatFromPence(selectedCurry.price)}
            </span>
          </div>
        ) : (
          <p className="text-sm font-bold text-brand-coral">Choose a curry to unlock the next step.</p>
        )}
      </div>

      <div className="space-y-4">
        {listForCategory("sides", "Bread & garnish")}
        {listForCategory("sauces", "Extras & treats")}
        {listForCategory("drinks", "Drinks")}
        {selection.notes && (
          <div className="rounded-lg border-2 border-black bg-white p-4 text-sm text-ink">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">Notes</p>
            <p className="mt-2">{selection.notes}</p>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-lg border-2 border-black bg-brand-blue p-5 text-sm text-brand-black">
        <div className="flex items-center justify-between font-bold">
          <span>Items</span>
          <span>{totals.itemCount}</span>
        </div>
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatFromPence(totals.subtotal)}</span>
        </div>
        <p className="text-xs text-brand-black/80">Delivery, loyalty redemptions, and tips calculated at checkout.</p>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          size="md"
          className="w-full"
          onClick={onNext}
          disabled={!canProceed}
        >
          {renderPrimaryLabel()}
        </Button>
        <Button
          variant="ghost"
          size="md"
          className="w-full text-ink"
          onClick={onPrev}
          disabled={step === "curry"}
        >
          Back
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-brand-coral"
          onClick={onReset}
        >
          Clear selection
        </Button>
      </div>
    </aside>
  );
}



