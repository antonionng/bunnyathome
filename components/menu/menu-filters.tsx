"use client";

import type { DietaryTag, SpiceLevel } from "@/types/builder";
import type { MenuDisplayCategory } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MenuFiltersProps {
  categories: MenuDisplayCategory[];
  activeCategory: MenuDisplayCategory | "all";
  onCategoryChange: (value: MenuDisplayCategory | "all") => void;
  dietaryOptions: DietaryTag[];
  selectedDietary: DietaryTag[];
  onDietaryToggle: (tag: DietaryTag) => void;
  spiceFilter: SpiceLevel | "any";
  onSpiceFilterChange: (value: SpiceLevel | "any") => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const spiceOptions: Array<SpiceLevel | "any"> = ["any", "Mild", "Hot", "Very Hot"];

export function MenuFilters({
  categories,
  activeCategory,
  onCategoryChange,
  dietaryOptions,
  selectedDietary,
  onDietaryToggle,
  spiceFilter,
  onSpiceFilterChange,
  searchValue,
  onSearchChange,
}: MenuFiltersProps) {
  return (
    <div className="space-y-6 rounded-2xl border-3 border-black bg-white p-6 shadow-xl section-border-coral">
      <div className="flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-ink-muted">
          Categories
        </p>
        <div className="flex flex-wrap gap-3">
          <CategoryPill
            label="All items"
            isActive={activeCategory === "all"}
            onClick={() => onCategoryChange("all")}
          />
          {categories.map((category) => (
            <CategoryPill
              key={category}
              label={category}
              isActive={activeCategory === category}
              onClick={() => onCategoryChange(category)}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,_1.5fr)_minmax(0,_1fr)]">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-ink-muted">
            Search menu
          </p>
          <Input
            placeholder="Search curries, breads, drinks..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-ink-muted">
            Spice level
          </p>
          <Select
            value={spiceFilter}
            onChange={(e) => onSpiceFilterChange(e.target.value as SpiceLevel | "any")}
          >
            {spiceOptions.map((option) => (
              <option key={option} value={option}>
                {option === "any" ? "Any heat" : option}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-ink/[0.02] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-ink-muted">
            Dietary tags
          </p>
          <span className="text-xs font-semibold text-ink-muted">
            {selectedDietary.length > 0 ? `${selectedDietary.length} selected` : "Tap to refine"}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 overflow-x-auto pb-1 md:overflow-visible">
          {dietaryOptions.map((tag) => (
            <Button
              key={tag}
              type="button"
              variant="outline"
              className={cn(
                "border-2 border-black px-3 py-2 text-[11px] font-bold uppercase tracking-wide",
                selectedDietary.includes(tag) && "!bg-brand-curry text-brand-black"
              )}
              onClick={() => onDietaryToggle(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface CategoryPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function CategoryPill({ label, isActive, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border-2 border-black px-5 py-2 text-sm font-bold text-ink transition-all hover:-translate-y-0.5",
        isActive ? "bg-brand-coral text-white shadow-lg" : "bg-white"
      )}
    >
      {label}
    </button>
  );
}

