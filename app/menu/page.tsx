"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DietaryTag, SpiceLevel } from "@/types/builder";
import type { MenuDisplayCategory, MenuProduct } from "@/types/menu";
import { MENU_DISPLAY_CATEGORIES, menuProducts } from "@/data/mock-products";
import { MenuFilters } from "@/components/menu/menu-filters";
import { MenuProductCard } from "@/components/menu/menu-product-card";
import { ReadyBoxCard } from "@/components/menu/ready-box-card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";

interface ReadyBoxConfig {
  id: string;
  name: string;
  description: string;
  image: string;
  badge: string;
  serves: string;
  includes: string[];
}

interface ReadyBoxDetail extends ReadyBoxConfig {
  price: number;
  highlights: string[];
  products: MenuProduct[];
}

const READY_BOXES: ReadyBoxConfig[] = [
  {
    id: "durban-family-feast",
    name: "Durban Family Feast",
    description: "Two family pots, sambals, a fresh loaf, and salted lassi to keep things cool.",
    image: "/curries/lamb-durban-placeholder.png",
    badge: "Family combo",
    serves: "Feeds 4-5",
    includes: ["family-beef", "family-chicken", "bread-loaf", "garnish-carrot", "drink-lassi"],
  },
  {
    id: "plant-power-pack",
    name: "Plant Power Pack",
    description: "Vegan bunny fillings, gluten-free loaf, tamarind fizz, and crunchy sambals.",
    image: "/curries/bunny/bean-bunny-placeholder.png",
    badge: "Vegan fave",
    serves: "Feeds 3",
    includes: ["bunny-bean", "family-bean", "bread-glutenfree", "garnish-carrot", "drink-soda"],
  },
  {
    id: "date-night-duo",
    name: "Date Night Bunny Duo",
    description: "Lamb & chicken bunny fillings, vetkoek sliders, chai, and sweet fritters.",
    image: "/curries/bunny/chicken-bunny-placeholder.png",
    badge: "Date night",
    serves: "Feeds 2-3",
    includes: ["bunny-lamb", "bunny-chicken", "bread-vetkoek", "drink-chai", "extra-fritters-ready"],
  },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuDisplayCategory | "all">("all");
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);
  const [spiceFilter, setSpiceFilter] = useState<SpiceLevel | "any">("any");
  const [searchValue, setSearchValue] = useState("");

  const addCatalogItem = useCartStore((state) => state.addCatalogItem);

  const dietaryOptions = useMemo<DietaryTag[]>(() => {
    const tags = new Set<DietaryTag>();
    menuProducts.forEach((product) => {
      product.dietaryTags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  const productLookup = useMemo(() => {
    const map = new Map<string, MenuProduct>();
    menuProducts.forEach((product) => {
      map.set(product.id, product);
    });
    return map;
  }, []);

  const filteredProducts = useMemo(() => {
    const text = searchValue.trim().toLowerCase();
    return menuProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "all" ? true : product.displayCategory === activeCategory;

      const matchesDietary =
        selectedDietary.length === 0 ||
        selectedDietary.every((tag) => product.dietaryTags?.includes(tag));

      const matchesSpice =
        spiceFilter === "any" ||
        (product.spiceLevel && product.spiceLevel === spiceFilter);

      const matchesSearch =
        text.length === 0 ||
        product.name.toLowerCase().includes(text) ||
        product.description.toLowerCase().includes(text);

      return matchesCategory && matchesDietary && matchesSpice && matchesSearch;
    });
  }, [activeCategory, selectedDietary, spiceFilter, searchValue]);

  const readyBoxes = useMemo<ReadyBoxDetail[]>(() => {
    return READY_BOXES.map((box) => {
      const products = box.includes
        .map((productId) => productLookup.get(productId))
        .filter((product): product is MenuProduct => Boolean(product));
      const price = products.reduce((sum, product) => sum + product.price, 0);
      return {
        ...box,
        price,
        highlights: products.map((product) => product.name),
        products,
      };
    });
  }, [productLookup]);

  const handleDietaryToggle = (tag: DietaryTag) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleAddProduct = (product: MenuProduct) => {
    const result = addCatalogItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      catalogCategory: product.catalogCategory,
      spiceLevel: product.spiceLevel,
      maxQuantity: product.maxQuantity,
    });

    if (!result.added) {
      toast.error("Limit reached", {
        description: product.maxQuantity
          ? `Only ${product.maxQuantity} per drop for this item.`
          : "Cannot add more of this item right now.",
      });
      return;
    }

    toast.success("Added to cart", {
      description: `${product.name} joined your box.${
        typeof result.remaining === "number" ? ` ${result.remaining} left for this drop.` : ""
      }`,
      action: {
        label: "View cart",
        onClick: () => {
          window.location.href = "/cart";
        },
      },
    });
  };

  const handleAddReadyBox = (box: ReadyBoxDetail) => {
    if (box.products.length === 0) {
      toast.error("Bundle unavailable", {
        description: "Those items aren’t on this week’s menu.",
      });
      return;
    }

    let addedCount = 0;
    const blocked: string[] = [];

    box.products.forEach((product) => {
      const result = addCatalogItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        catalogCategory: product.catalogCategory,
        spiceLevel: product.spiceLevel,
        maxQuantity: product.maxQuantity,
      });

      if (result.added) {
        addedCount += 1;
      } else {
        blocked.push(product.name);
      }
    });

    if (addedCount > 0) {
      toast.success(`${box.name} stacked`, {
        description: blocked.length
          ? `${addedCount} items added · ${blocked.join(", ")} already maxed.`
          : `${addedCount} items added to your cart.`,
      });
    }

    if (blocked.length > 0 && addedCount === 0) {
      toast.error("Limit reached", {
        description: `${blocked.join(", ")} already at their limit.`,
      });
    }
  };

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border-3 border-black bg-brand-blue p-10 shadow-2xl section-border-green">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="tag-pill bg-brand-black text-white">New · View the full spread</span>
            <h1 className="text-4xl font-black text-brand-black lg:text-5xl">
              Tap through every curry, loaf, sauce, and sip we drop weekly.
            </h1>
            <p className="text-lg text-brand-black/80">
              Filters for dietary legends, hover states for spice intel, and one-tap add-to-cart
              so you can grab sauces or breads without running the full builder gauntlet.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="border-3 border-black bg-brand-black text-white">
                <Link href="/builder">🔥 Build your box</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-3 border-black bg-white text-brand-black"
              >
                <Link href="/cart">View cart</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border-2 border-black bg-white/80 p-5 text-sm font-semibold text-ink shadow-lg">
            <p>⏰ Orders lock Tuesday · Deliveries land by Friday braai-time.</p>
            <p className="mt-2">
              £5 delivery under £50 carts · freebies kick in once you cross the threshold.
            </p>
          </div>
        </div>
      </section>

      <MenuFilters
        categories={MENU_DISPLAY_CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        dietaryOptions={dietaryOptions}
        selectedDietary={selectedDietary}
        onDietaryToggle={handleDietaryToggle}
        spiceFilter={spiceFilter}
        onSpiceFilterChange={setSpiceFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <section className="space-y-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-ink-muted">
            Showing {filteredProducts.length} items
          </p>
          {selectedDietary.length > 0 && (
            <p className="text-sm font-semibold text-ink">
              Dietary filters: {selectedDietary.join(", ")}
            </p>
          )}
        </div>
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border-3 border-black bg-white p-12 text-center shadow-xl">
            <p className="text-2xl font-bold text-ink">Eish, nothing matches those filters.</p>
            <p className="mt-3 text-ink-muted">
              Reset a tag or spice level to see the full spread again.
            </p>
            <Button
              className="mt-6 border-3 border-black bg-brand-curry text-brand-black"
              onClick={() => {
                setActiveCategory("all");
                setSelectedDietary([]);
                setSpiceFilter("any");
                setSearchValue("");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <MenuProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddProduct}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <span className="tag-pill bg-brand-black text-white">Shortcut · Ready-built boxes</span>
          <h2 className="text-3xl font-black text-ink lg:text-4xl">Add a curated box in one tap</h2>
          <p className="text-lg text-ink-muted">
            Chef-built combos with balanced heat, breads, sides, and sips. Perfect when you just
            want Durban flavours without the admin.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {readyBoxes.map((box) => (
            <ReadyBoxCard key={box.id} box={box} onAdd={() => handleAddReadyBox(box)} />
          ))}
        </div>
      </section>
    </div>
  );
}

