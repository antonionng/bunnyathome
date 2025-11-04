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
      <div key={category} className="space-y-3 rounded-3xl border border-border-subtle bg-white/85 p-5">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
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
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-ink-muted">Qty {quantity}</p>
                </div>
                <span className="text-sm font-semibold text-brand-curry">
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
    <aside className="glass-panel flex h-fit flex-col gap-6 p-6">
      <div className="space-y-2">
        <span className="tag-pill bg-brand-curry/20 text-brand-black">Your box</span>
        <h3 className="text-xl font-semibold text-ink">Durban night in</h3>
        <p className="text-sm text-ink-muted">
          Keep tweaking flavour, spice, and pairings. We’ll save this box to your profile soon.
        </p>
      </div>

      <div className="space-y-3 rounded-3xl border border-brand-curry/40 bg-white/80 p-5">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
          <span>Bunny filling</span>
          <span>Spice · {selection.currySpiceLevel}</span>
        </div>
        {selectedCurry ? (
          <div className="space-y-2">
            <p className="text-lg font-semibold text-ink">{selectedCurry.name}</p>
            <p className="text-sm text-ink-muted">{selectedCurry.description}</p>
            <span className="text-sm font-semibold text-brand-curry">
              {formatFromPence(selectedCurry.price)}
            </span>
          </div>
        ) : (
          <p className="text-sm text-brand-coral">Choose a curry to unlock the next step.</p>
        )}
      </div>

      <div className="space-y-4">
        {listForCategory("sides", "Bread & garnish")}
        {listForCategory("sauces", "Extras & treats")}
        {listForCategory("drinks", "Drinks")}
        {selection.notes && (
          <div className="rounded-3xl border border-border-subtle bg-white/85 p-4 text-sm text-ink">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">Notes</p>
            <p className="mt-2">{selection.notes}</p>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-3xl border border-brand-blue/40 bg-white/85 p-5 text-sm text-ink">
        <div className="flex items-center justify-between font-semibold">
          <span>Items</span>
          <span>{totals.itemCount}</span>
        </div>
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatFromPence(totals.subtotal)}</span>
        </div>
        <p className="text-xs text-ink-muted">Delivery, loyalty redemptions, and tips calculated at checkout.</p>
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
          className="w-full border-brand-coral/50 text-brand-coral"
          onClick={onReset}
        >
          Clear selection
        </Button>
      </div>
    </aside>
  );
}



