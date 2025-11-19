<!-- 96006cca-3601-4da5-a651-a5263e5395b0 f667cf22-ea84-4fde-a1a9-a1f2a17d1679 -->
# Menu + Delivery Enhancements Plan

## 1. Extend product data for menu context

- Enrich `data/mock-products.ts` with shared shape for menu cards (dietary tags, serving notes, availability flags).
- Add/adjust supporting types (e.g., `types/builder.ts` or new `types/menu.ts`) so menu components and cart helpers can rely on consistent metadata.

## 2. Build interactive menu experience

- Create `app/menu/page.tsx` that composes a new `components/menu` module (filters, category nav, product cards, hover/expand panels with dietary + delivery notes).
- Implement client-side filtering (category pills, dietary toggles, spice level select) and ensure product cards can show hover details plus mobile-friendly disclosure states.
- Reuse catalog data; wire a CTA in each card to add specific items to the cart without entering the builder.

## 3. Wire global View Menu CTAs

- Update the hero CTA stack in `app/page.tsx` to add a `View menu` button beside `Build your box`.
- Add a matching CTA in `components/layout/site-header.tsx` (and any shared CTA components such as `components/layout/sticky-builder-cta.tsx` if present) so “View menu” is accessible site-wide.

## 4. Support add-to-cart outside builder

- Extend `store/cart-store.ts` with a helper like `addCatalogItem` that accepts catalog metadata, reuses existing pricing, and merges quantities per product ID.
- Create a lightweight `AddToCartButton` inside the menu components (and optionally expose it for future reuse) that shows feedback/toasts and respects `maxQuantity` limits.

## 5. Surface delivery details through builder & checkout

- Update `components/builder/summary-panel.tsx` to include delivery messaging (fee threshold, weekly lock/delivery rhythm) so shoppers understand logistics before checkout.
- Enhance `components/cart/cart-summary.tsx`, `app/cart/page.tsx`, and `components/checkout/order-summary.tsx` with the same copy block + iconography referencing the £5 flat fee / free-over-£50 rule and the Tuesday lock / Friday delivery cadence.

## 6. Smoke test

- Manually verify `/menu` filters + hover states, adding several items (sauce-only) to the cart, and confirm delivery messaging appears in builder summary, cart, and checkout.

## Implementation Todos

- setup-data: Extend mock catalog + types for menu metadata
- build-menu-ui: Implement `/menu` page & interactive cards w/ filters and hover details
- cta-updates: Add View Menu CTA in hero + header (and shared CTAs if needed)
- cart-hook: Add menu add-to-cart helper + UI feedback
- delivery-copy: Add delivery info blocks to builder summary, cart, checkout
- qa-pass: Manual smoke test of new menu/cart/delivery flows