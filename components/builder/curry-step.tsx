"use client";

import { useMemo } from "react";
import { CurryQuantityCard } from "@/components/builder/curry-quantity-card";
import { HelperTooltip } from "@/components/ui/helper-tooltip";
import { useBuilderStore } from "@/store/builder-store";
import type { BuilderCatalog } from "@/types/builder";

interface CurryStepProps {
  bunnyFillings: BuilderCatalog["bunnyFillings"];
  familyCurries: BuilderCatalog["familyCurries"];
}

export function CurryStep({ bunnyFillings, familyCurries }: CurryStepProps) {
  const bunnyFillingsState = useBuilderStore((state) => state.bunnyFillings);
  const familyCurriesState = useBuilderStore((state) => state.familyCurries);
  const flow = useBuilderStore((state) => state.flow);
  const addCurry = useBuilderStore((state) => state.addCurry);
  const removeCurry = useBuilderStore((state) => state.removeCurry);
  const updateCurrySpice = useBuilderStore((state) => state.updateCurrySpice);
  const incrementCurry = useBuilderStore((state) => state.incrementCurry);
  const decrementCurry = useBuilderStore((state) => state.decrementCurry);
  const sides = useBuilderStore((state) => state.sides);

  const hasBunnyFillings = Object.keys(bunnyFillingsState).length > 0;
  const hasFamilyCurries = Object.keys(familyCurriesState).length > 0;
  const hasBread = sides["bread-loaf"] || sides["bread-vetkoek"] || sides["bread-glutenfree"];

  // Determine which section to show based on flow
  const showBunnyFillings = bunnyFillings.length > 0;
  const showFamilyCurries = familyCurries.length > 0;

  const stepNumber = flow === "curry" ? "1" : "2";
  const totalSelected = Object.keys(bunnyFillingsState).length + Object.keys(familyCurriesState).length;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-3">
        {flow === "bunny" && showFamilyCurries && (
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-brand-green bg-brand-green px-4 py-2">
            <span className="text-xl">🍲</span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black">
              Stack more? · Optional upsell
            </span>
          </div>
        )}
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-coral px-4 py-2">
          <span className="text-xl">🌶️</span>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black">
            Step {stepNumber} · {showBunnyFillings && !showFamilyCurries ? "Bunny fillings" : showFamilyCurries && !showBunnyFillings ? "Family curries" : "Choose curries"}
          </span>
        </div>
        <h2 className="text-4xl font-bold text-ink lg:text-5xl">
          {flow === "bunny" && showFamilyCurries && !showBunnyFillings
            ? "Got family coming? Stack some curry pots too!"
            : showBunnyFillings && !showFamilyCurries
            ? "Load up your bunny fillings."
            : showFamilyCurries && !showBunnyFillings
            ? "Stack the family curry pots."
            : "Mix bunny fillings & family pots."}
        </h2>
        <p className="max-w-2xl text-xl text-ink-muted">
          {flow === "bunny" && showFamilyCurries && !showBunnyFillings
            ? "These 800g beauties feed the whole crew - perfect for leftovers or meal prep. More gravy, less potato, lekker with rice, pap, or roti!"
            : showBunnyFillings && !showFamilyCurries
            ? "Each bunny filling is 580-600g, packed with potato, perfect for hollowed loaves. Dial the spice with every pot."
            : showFamilyCurries && !showBunnyFillings
            ? "Each family pot is 800g, extra gravy, less potato. Perfect for rice, pap, or roti. Feed 2-3 hungry okes or meal prep for days!"
            : "Load up on loaf-ready bunny fillings, family-size curry bowls, or both. Each one ships with spice boosters so you can dial the heat at your table."}
        </p>
        {totalSelected > 0 && (
          <p className="text-lg font-bold text-brand-coral">
            ✓ {totalSelected} {totalSelected === 1 ? "pot" : "pots"} stacked, lekker!
          </p>
        )}
        {flow === "bunny" && showFamilyCurries && !showBunnyFillings && totalSelected === 0 && (
          <div className="rounded-xl border-2 border-dashed border-brand-green bg-brand-green/10 p-5">
            <p className="text-base font-bold text-brand-black">
              💡 Pro tip: Add family pots to feed more okes or meal prep for the week. Or skip ahead if your bunny chow is enough!
            </p>
          </div>
        )}
      </div>

      {/* Bunny Fillings Section */}
      {showBunnyFillings && (
        <div className="space-y-6">
          <div className="rounded-2xl border-3 border-black bg-brand-curry p-6 shadow-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-3xl font-bold text-brand-black">
                  🥖 Bunny Fillings
                </h3>
                <p className="mt-2 text-base text-brand-black/80">
                  580-600g portions · Loaf-ready · Packed with potato
                </p>
              </div>
              {hasBunnyFillings && !hasBread && flow === "bunny" && (
                <span className="rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-coral">
                  🍞 Loaf sorted already!
                </span>
              )}
            </div>
          </div>

          <HelperTooltip variant="tip">
            <strong>How to bunny chow:</strong> Quarter the loaf, hollow it out, pack with curry —
            that's the Durban way, boet! Each filling serves 2-3 quarter loaves. Mix flavors if the crew
            can't decide!
          </HelperTooltip>

          <div className="grid gap-6 md:grid-cols-2">
            {bunnyFillings.map((curry) => (
              <CurryQuantityCard
                key={curry.id}
                curry={curry}
                selection={bunnyFillingsState[curry.id]}
                onAdd={(spiceLevel) => addCurry("bunny", curry.id, spiceLevel)}
                onRemove={() => removeCurry("bunny", curry.id)}
                onIncrement={() => incrementCurry("bunny", curry.id)}
                onDecrement={() => decrementCurry("bunny", curry.id)}
                onSpiceChange={(spiceLevel) =>
                  updateCurrySpice("bunny", curry.id, spiceLevel)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Family Curries Section */}
      {showFamilyCurries && (
        <div className="space-y-6">
          <div className="rounded-2xl border-3 border-black bg-brand-green p-6 shadow-xl">
            <div>
              <h3 className="text-3xl font-bold text-brand-black">
                🍲 Family Durban Curries
              </h3>
              <p className="mt-2 text-base text-brand-black/80">
                800g portions · Bowl & plate ready · More gravy, less potato
              </p>
            </div>
          </div>

          <HelperTooltip variant="info">
            <strong>Feed the whole fam:</strong> These bigger pots have more gravy, less potato —
            perfect for plating with rice, pap, or roti. Each serves 2-3 hungry people or sorts
            meal prep for days. Sharp sharp!
          </HelperTooltip>

          <div className="grid gap-6 md:grid-cols-2">
            {familyCurries.map((curry) => (
              <CurryQuantityCard
                key={curry.id}
                curry={curry}
                selection={familyCurriesState[curry.id]}
                onAdd={(spiceLevel) => addCurry("family", curry.id, spiceLevel)}
                onRemove={() => removeCurry("family", curry.id)}
                onIncrement={() => incrementCurry("family", curry.id)}
                onDecrement={() => decrementCurry("family", curry.id)}
                onSpiceChange={(spiceLevel) =>
                  updateCurrySpice("family", curry.id, spiceLevel)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Smart tip if bunny filling but no bread (only for curry-first flow) */}
      {hasBunnyFillings && !hasBread && flow === "curry" && (
        <HelperTooltip variant="warning">
          <strong>Eish!</strong> You've got bunny fillings but no loaf yet. We'll remind you on
          the next step — you'll need bread to make it a proper bunny chow, boet!
        </HelperTooltip>
      )}
    </div>
  );
}
