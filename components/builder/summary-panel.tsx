"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import { DeliveryInfo } from "@/components/ui/delivery-info";
import { formatFromPence } from "@/lib/currency";
import { useCartStore } from "@/store/cart-store";
import { useBuilderStore } from "@/store/builder-store";
import { toast } from "sonner";
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
  const router = useRouter();
  const addFromBuilder = useCartStore((state) => state.addFromBuilder);
  const cartItemCount = useCartStore((state) => state.items.length);
  const markAsSaved = useBuilderStore((state) => state.markAsSaved);
  const hasUnsavedChanges = useBuilderStore((state) => state.hasUnsavedChanges);
  const { confirm, dialogProps } = useConfirmDialog();
  
  const bunnyFillingCount = Object.keys(selection.bunnyFillings).length;
  const familyCurryCount = Object.keys(selection.familyCurries).length;
  const hasCurries = bunnyFillingCount > 0 || familyCurryCount > 0;
  const hasBread = selection.sides["bread-loaf"] || selection.sides["bread-vetkoek"] || selection.sides["bread-glutenfree"];
  const hasSides = Object.keys(selection.sides).length > 0;
  const hasDrinks = Object.keys(selection.drinks).length > 0;
  const isBoxLookingGood = hasCurries && (hasSides || hasDrinks);

  const handleAddToCart = () => {
    addFromBuilder({ selection, catalog });
    markAsSaved();
    toast.success("Sharp sharp! Box stacked! 🔥", {
      description: "Your box is in the cart, legend. Build another or lock it in at checkout.",
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  const handleStartNewBox = () => {
    if (hasUnsavedChanges && hasCurries) {
      confirm({
        title: "Eish! Clear this spread?",
        description: "You've got unsaved goodies. This will wipe your current box selection, boet.",
        confirmText: "Clear Selection",
        cancelText: "Keep Building",
        variant: "danger",
        onConfirm: () => {
          onReset();
          toast.success("Builder cleared, sharp!", {
            description: "Ready to stack another lekker box!",
          });
        },
      });
    } else {
      onReset();
      toast.success("Builder cleared", {
        description: "Ready to build another box!",
      });
    }
  };

  const listCurries = (
    type: "bunny" | "family",
    label: string,
    bgColor: string
  ) => {
    const curries = type === "bunny" ? selection.bunnyFillings : selection.familyCurries;
    const catalogItems = type === "bunny" ? catalog.bunnyFillings : catalog.familyCurries;
    const entries = Object.entries(curries);

    if (entries.length === 0) {
      return null;
    }

    return (
      <div key={type} className={`space-y-3 rounded-lg ${bgColor} p-5 shadow-md`}>
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-brand-black">
          <span>{label}</span>
          <span>{entries.length} selected</span>
        </div>
        <ul className="space-y-3">
          {entries.map(([id, curry]) => {
            const product = catalogItems.find((item) => item.id === id);
            if (!product) {
              return null;
            }
            return (
              <li key={id} className="space-y-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-brand-black">{product.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-brand-black/80">
                      <span>Qty {curry.quantity}</span>
                      <span>·</span>
                      <span className="font-bold uppercase tracking-wider text-brand-coral">
                        {curry.spiceLevel}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-brand-black">
                    {formatFromPence(product.price * curry.quantity)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

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
      return "Stack it in the cart! 🔥";
    }
    if (!hasCurries) {
      return "Choose a curry to roll, boet";
    }
    return "Next step →";
  };

  const handlePrimaryAction = () => {
    if (step === "summary") {
      handleAddToCart();
    } else {
      onNext();
    }
  };

  return (
    <aside className="rounded-2xl border-3 border-black bg-white p-6 shadow-xl flex h-fit flex-col gap-6 section-border-pink">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-pink px-4 py-2">
            <span className="text-base">📦</span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-black">Your box</span>
          </span>
          {hasUnsavedChanges && (
            <span className="text-xs font-bold text-brand-coral">● Unsaved</span>
          )}
        </div>
        <h3 className="text-2xl font-bold text-ink">
          {isBoxLookingGood ? "Lekker spread, legend! 🔥" : "Stack your Durban night in"}
        </h3>
        <p className="text-base text-ink-muted">
          {isBoxLookingGood
            ? "Sharp sharp! Keep building or lock it in the cart."
            : "Start with curries, load up the sides, and cool it down with drinks."}
        </p>
        {cartItemCount > 0 && (
          <p className="text-sm font-bold text-brand-green">
            ✓ {cartItemCount} {cartItemCount !== 1 ? "boxes" : "box"} already in cart
          </p>
        )}
      </div>

      {!hasCurries && (
        <div className="rounded-xl border-3 border-dashed border-brand-coral bg-brand-curry/20 p-5 text-center">
          <p className="text-base font-bold text-brand-coral">
            🍲 Your box is hungry! Stack a curry first, boet.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {listCurries("bunny", "🥖 Bunny Fillings", "bg-brand-curry")}
        {listCurries("family", "🍲 Family Curries", "bg-brand-green")}
        
        {bunnyFillingCount > 0 && !hasBread && (
          <div className="rounded-xl border-2 border-brand-coral bg-brand-curry/20 p-4">
            <p className="text-sm font-bold text-brand-coral">
              🍞 Eish! Grab a loaf for your bunny fillings, boet!
            </p>
          </div>
        )}

        {listForCategory("sides", "🥗 Sides & garnish")}
        {listForCategory("sauces", "🍢 Extras & treats")}
        {listForCategory("drinks", "🥤 Drinks")}
        
        {selection.notes && (
          <div className="rounded-lg border-2 border-black bg-white p-4 text-sm text-ink">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">Notes</p>
            <p className="mt-2">{selection.notes}</p>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-xl border-3 border-black bg-brand-blue p-6 text-base text-brand-black shadow-xl">
        <div className="flex items-center justify-between font-bold">
          <span>Items</span>
          <span>{totals.itemCount}</span>
        </div>
        <div className="flex items-center justify-between text-2xl font-bold">
          <span>Total</span>
          <span>{formatFromPence(totals.subtotal)}</span>
        </div>
        <p className="text-xs text-brand-black/80">Delivery, loyalty rewards, and tips sorted at checkout, boet!</p>
      </div>
      <DeliveryInfo />

      <div className="flex flex-col gap-3">
        {step === "summary" ? (
          <>
            <Button
              size="lg"
              className="w-full border-3 border-black bg-brand-black text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              onClick={handleAddToCart}
              disabled={!canProceed}
            >
              {renderPrimaryLabel()}
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full border-2 border-black"
              onClick={handleStartNewBox}
            >
              🔄 Stack another box
            </Button>
            {cartItemCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-brand-green font-bold"
                onClick={() => router.push("/cart")}
              >
                View Cart ({cartItemCount})
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              size="lg"
              className="w-full border-3 border-black bg-brand-black text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              onClick={handlePrimaryAction}
              disabled={!canProceed}
            >
              {renderPrimaryLabel()}
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="w-full text-ink"
              onClick={onPrev}
              disabled={step === "base" || step === "curry"}
            >
              ← Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-brand-coral border-2"
              onClick={handleStartNewBox}
            >
              Clear selection
            </Button>
          </>
        )}
      </div>

      <ConfirmDialog {...dialogProps} />
    </aside>
  );
}
