"use client";

import { useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BunnyBuilderStep } from "@/components/builder/bunny-builder-step";
import { CurryStep } from "@/components/builder/curry-step";
import { QuantityStep } from "@/components/builder/quantity-step";
import { SummaryPanel } from "@/components/builder/summary-panel";
import { Stepper } from "@/components/ui/stepper";
import { mockCatalog } from "@/data/mock-products";
import { calculateTotals, useBuilderStore } from "@/store/builder-store";
import type { BuilderCatalog, BuilderSelection, BuilderStep } from "@/types/builder";

const catalog: BuilderCatalog = mockCatalog;

const bunnyFillingPrices: Record<string, number> = Object.fromEntries(
  catalog.bunnyFillings.map((item) => [item.id, item.price])
);

const familyCurryPrices: Record<string, number> = Object.fromEntries(
  catalog.familyCurries.map((item) => [item.id, item.price])
);

const otherPrices: Record<string, number> = {
  ...Object.fromEntries(catalog.sides.map((item) => [item.id, item.price])),
  ...Object.fromEntries(catalog.sauces.map((item) => [item.id, item.price])),
  ...Object.fromEntries(catalog.drinks.map((item) => [item.id, item.price])),
};

const renderStepComponent = (step: Exclude<BuilderStep, "summary">, flow: "bunny" | "curry" | null) => {
  // Filter breads from sides catalog
  const breads = catalog.sides.filter(item => item.id.includes('bread'));
  const otherSides = catalog.sides.filter(item => !item.id.includes('bread'));

  switch (step) {
    case "bunny-builder":
      return (
        <BunnyBuilderStep 
          breads={breads} 
          bunnyFillings={catalog.bunnyFillings}
          isOptional={flow === "curry"}
        />
      );
    case "curry":
      // Show only family curries (bunny fillings are now in bunny-builder step)
      return <CurryStep bunnyFillings={[]} familyCurries={catalog.familyCurries} />;
    case "sides":
      return (
        <QuantityStep
          category="sides"
          catalog={otherSides}
          tagLabel="Step 3 · Sides & garnish"
          title="Load up on Durban favourites."
          description="Scoop up carrot salad, pickled veg, and all the garnishes that make bunny chow lekker."
          hint="Carrot sambals are a must, boet!"
        />
      );
    case "sauces":
      return (
        <QuantityStep
          category="sauces"
          catalog={catalog.sauces}
          tagLabel="Step 4 · Extras & treats"
          title="Round it out with braai snacks."
          description="Pumpkin fritters, samoosas, boerewors, biltong—stack the box high with all the good stuff."
          hint="Pumpkin fritters sell out fast, sharp sharp!"
        />
      );
    case "drinks":
      return (
        <QuantityStep
          category="drinks"
          catalog={catalog.drinks}
          tagLabel="Step 5 · Drinks"
          title="Cool down the spice."
          description="Cardamom chai, salted lassi, tamarind fizz. Chill a few bottles and you're sorted."
          hint="Lassi is lekker for taming the heat!"
        />
      );
  }
};

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const flowParam = searchParams.get("flow");
  const parsedFlow: "bunny" | "curry" | null =
    flowParam === "bunny" || flowParam === "curry" ? flowParam : null;

  const step = useBuilderStore((state) => state.step);
  const flow = useBuilderStore((state) => state.flow);
  const setFlow = useBuilderStore((state) => state.setFlow);
  const getStepOrder = useBuilderStore((state) => state.getStepOrder);
  const goToStep = useBuilderStore((state) => state.goToStep);
  const nextStep = useBuilderStore((state) => state.nextStep);
  const prevStep = useBuilderStore((state) => state.prevStep);
  const reset = useBuilderStore((state) => state.reset);

  // Set flow from URL param on mount
  useEffect(() => {
    if (parsedFlow && parsedFlow !== flow) {
      setFlow(parsedFlow);
    }
  }, [parsedFlow, flow, setFlow]);
  
  // Individual selectors to avoid recreating objects
  const bunnyFillings = useBuilderStore((state) => state.bunnyFillings);
  const familyCurries = useBuilderStore((state) => state.familyCurries);
  const sides = useBuilderStore((state) => state.sides);
  const sauces = useBuilderStore((state) => state.sauces);
  const drinks = useBuilderStore((state) => state.drinks);
  const notes = useBuilderStore((state) => state.notes);

  const selection = useMemo<BuilderSelection>(
    () => ({
      bunnyFillings,
      familyCurries,
      sides,
      sauces,
      drinks,
      notes,
    }),
    [bunnyFillings, familyCurries, sides, sauces, drinks, notes]
  );

  const hasCurries = useMemo(
    () => Object.keys(bunnyFillings).length > 0 || Object.keys(familyCurries).length > 0,
    [bunnyFillings, familyCurries]
  );

  const totals = useMemo(
    () => calculateTotals(selection, bunnyFillingPrices, familyCurryPrices, otherPrices),
    [selection]
  );

  const handleStepClick = (target: BuilderStep) => {
    const stepOrder = getStepOrder();
    const currentIndex = stepOrder.indexOf(step);
    const targetIndex = stepOrder.indexOf(target);
    const attemptingForward = targetIndex > currentIndex;

    if (attemptingForward && !hasCurries) {
      return;
    }

    goToStep(target);
  };

  const handleNext = () => {
    if (step === "summary") {
      return;
    }
    if (step === "curry") {
      if (!hasCurries) {
        return;
      }
    }
    nextStep();
  };

  const handlePrev = () => {
    if (step === "curry") {
      return;
    }
    prevStep();
  };

  const canProceed = step === "curry" ? hasCurries : true;

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg section-border-curry">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-curry px-4 py-2">
                <span className="text-xl">{flow === "bunny" ? "🥖" : flow === "curry" ? "🍲" : "🔥"}</span>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black">Custom box builder</span>
              </div>
              <h1 className="mt-4 text-4xl font-bold text-ink lg:text-5xl">
                {flow === "bunny"
                  ? "Load the loaf, then stack the curry!"
                  : flow === "curry"
                  ? "Crank the curry, then match the loaf!"
                  : "Craft your Durban bunny chow night."}
              </h1>
            </div>
            <p className="max-w-xl text-xl text-ink-muted">
              Tune spice levels, load up braai snacks, and cool it down with lekker drinks. Your build gets saved for lightning-fast reorders, boet!
            </p>
          </div>
          <Stepper current={step} onStepClick={handleStepClick} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,_1fr)_380px]">
        <div className="space-y-12">
          {step === "summary" ? (
            <div className="rounded-2xl border-3 border-black bg-white p-8 shadow-xl text-center section-border-coral">
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-coral px-4 py-2 mb-4">
                <span className="text-xl">🔥</span>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black">Step {flow === "bunny" ? "5" : "5"} · Your Spread</span>
              </div>
              <h2 className="mt-6 text-4xl font-bold text-ink lg:text-5xl">Sharp sharp! Your feast is ready.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-xl text-ink-muted">
                Checkout's being fine-tuned — soon you'll send this straight to your door or save it for recurring drops. For now, screenshot or keep stacking!
              </p>
            </div>
          ) : (
            renderStepComponent(step, flow)
          )}
        </div>
        <SummaryPanel
          step={step}
          selection={selection}
          catalog={catalog}
          totals={totals}
          onNext={handleNext}
          onPrev={handlePrev}
          onReset={reset}
          canProceed={canProceed}
        />
      </div>
    </div>
  );
}

