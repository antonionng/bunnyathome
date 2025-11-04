"use client";

import { useMemo } from "react";
import { BunnyModal } from "@/components/builder/bunny-modal";
import { CurryStep } from "@/components/builder/curry-step";
import { QuantityStep } from "@/components/builder/quantity-step";
import { SummaryPanel } from "@/components/builder/summary-panel";
import { Stepper } from "@/components/ui/stepper";
import { mockCatalog } from "@/data/mock-products";
import { calculateTotals, useBuilderStore } from "@/store/builder-store";
import type { BuilderCatalog, BuilderSelection, BuilderStep } from "@/types/builder";

const catalog: BuilderCatalog = mockCatalog;

const priceMap: Record<string, number> = {
  ...Object.fromEntries(catalog.sides.map((item) => [item.id, item.price])),
  ...Object.fromEntries(catalog.sauces.map((item) => [item.id, item.price])),
  ...Object.fromEntries(catalog.drinks.map((item) => [item.id, item.price])),
};

const renderStepComponent = (step: Exclude<BuilderStep, "summary">) => {
  switch (step) {
    case "curry":
      return <CurryStep catalog={catalog.curries} />;
    case "sides":
      return (
        <QuantityStep
          category="sides"
          catalog={catalog.sides}
          tagLabel="Step 2 · Bread & garnish"
          title="Add your loaf and garnishes."
          description="Pick the classic bunny loaf, vetkoek for sharing, or a gluten-free bake. Don’t forget the pickled carrot salad for proper crunch."
          hint="Start with a soft white bunny loaf."
        />
      );
    case "sauces":
      return (
        <QuantityStep
          category="sauces"
          catalog={catalog.sauces}
          tagLabel="Step 3 · Extras & treats"
          title="Round it out with Durban favourites."
          description="Scoop up pumpkin fritters, samoosas, boerewors, or braai-ready meats to build your spread."
          hint="Pumpkin fritters sell out fast."
        />
      );
    case "drinks":
      return (
        <QuantityStep
          category="drinks"
          catalog={catalog.drinks}
          tagLabel="Step 4 · Drinks"
          title="Sip pairings to finish the ritual."
          description="Cardamom chai, salted lassi, tamarind fizz. Chill a few bottles and you're set."
          hint="Keep spice in check with a cooling sip."
        />
      );
  }
};

const stepOrder: BuilderStep[] = ["curry", "sides", "sauces", "drinks", "summary"];

export default function BuilderPage() {
  const step = useBuilderStore((state) => state.step);
  const goToStep = useBuilderStore((state) => state.goToStep);
  const nextStep = useBuilderStore((state) => state.nextStep);
  const prevStep = useBuilderStore((state) => state.prevStep);
  const reset = useBuilderStore((state) => state.reset);
  const openBunnyModal = useBuilderStore((state) => state.openBunnyModal);
  const closeBunnyModal = useBuilderStore((state) => state.closeBunnyModal);
  const markBunnyPromptSeen = useBuilderStore((state) => state.markBunnyPromptSeen);
  const setItemQuantity = useBuilderStore((state) => state.setItemQuantity);
  const bunnyPromptSeen = useBuilderStore((state) => state.bunnyPromptSeen);
  
  // Individual selectors to avoid recreating objects
  const curryId = useBuilderStore((state) => state.curryId);
  const currySpiceLevel = useBuilderStore((state) => state.currySpiceLevel);
  const sides = useBuilderStore((state) => state.sides);
  const sauces = useBuilderStore((state) => state.sauces);
  const drinks = useBuilderStore((state) => state.drinks);
  const notes = useBuilderStore((state) => state.notes);

  const selection = useMemo<BuilderSelection>(
    () => ({
      curryId,
      currySpiceLevel,
      sides,
      sauces,
      drinks,
      notes,
    }),
    [curryId, currySpiceLevel, sides, sauces, drinks, notes]
  );

  const selectedCurry = useMemo(
    () => catalog.curries.find((curry) => curry.id === curryId) ?? null,
    [curryId]
  );

  const totals = useMemo(
    () => calculateTotals(selection, priceMap, selectedCurry?.price ?? null),
    [selection, selectedCurry?.price]
  );

  const handleStepClick = (target: BuilderStep) => {
    const currentIndex = stepOrder.indexOf(step);
    const targetIndex = stepOrder.indexOf(target);
    const attemptingForward = targetIndex > currentIndex;

    if (attemptingForward && !curryId) {
      return;
    }

    goToStep(target);
  };

  const handleNext = () => {
    if (step === "summary") {
      return;
    }
    if (step === "curry") {
      if (!curryId) {
        return;
      }
      if (!bunnyPromptSeen) {
        openBunnyModal();
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

  const canProceed = step === "curry" ? !!curryId : true;

  const handleMakeBunny = () => {
    markBunnyPromptSeen();
    closeBunnyModal();
    setItemQuantity("sides", "bread-loaf", 1);
    goToStep("sides");
  };

  const handleSkipBunny = () => {
    markBunnyPromptSeen();
    closeBunnyModal();
    nextStep();
  };

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg section-border-curry">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="tag-pill bg-brand-curry text-brand-black">Custom box builder</span>
              <h1 className="mt-3 text-3xl font-bold text-ink">
                Craft your Durban bunny chow night.
              </h1>
            </div>
            <p className="max-w-xl text-sm text-ink-muted">
              Tune spice levels, load up sides, and pick your ritual drinks. We'll save this build to your
              account soon.
            </p>
          </div>
          <Stepper current={step} onStepClick={handleStepClick} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,_1fr)_380px]">
        <div className="space-y-12">
          {step === "summary" ? (
            <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-lg text-center section-border-green">
              <span className="tag-pill mx-auto bg-brand-green text-brand-black">
                Step 5 · Summary
              </span>
              <h2 className="mt-6 text-3xl font-bold text-ink">Your Durban feast is locked in.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-ink-muted">
                We're polishing the checkout flow — soon you'll send this box straight to your door or save
                it for recurring deliveries. For now, take a screenshot or keep building.
              </p>
            </div>
          ) : (
            renderStepComponent(step)
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
      <BunnyModal catalog={catalog.curries} onMakeBunny={handleMakeBunny} onSkip={handleSkipBunny} />
    </div>
  );
}

