# BunnyAtHome Homepage Refresh

## 1. Experience Audit

### Overall Wins
- Strong modular layout with rounded cards and clear section labels (e.g., `tag-pill` badges in `app/page.tsx`) already creates a system for storytelling.
- Builder CTA hierarchy (primary `/builder`, secondary `#drops`) is consistent across hero and “Ready to cook?” banner, reinforcing the key conversion goal.
- Product photography inside `/public/drops/*` aligns with appetite appeal and already covers vegetarian + meat options.
- Loyalty and referral proof points (testimonials, Trustpilot, 500+ members) provide early-stage trust.

### Friction & Gaps by Section
- **Header / Hero**: Headlines (“Durban-born bunny chow nights…”) feel descriptive but not urgent; no mention of price/servings until user scrolls. CTA labels are functional but lack South African personality.
- **Featured Drop Card**: “Featured drop” badge + price chip are good, but there is no live inventory signal (limited drop, sells out) or add-to-basket micro interaction; hero lacks motion, aromas, or table scene.
- **Mini Feature Grid**: Repeats benefits, yet icons/imagery missing; blocks look alike, creating “wall of white” rather than colourful energy promised by brand palette.
- **Build Your Spread**: Copy explains flow but doesn’t show toggles/previews of the actual builder steps. No price cues or portion highlights for breads/garnishes.
- **Ritual Section**: Differentiator cards rely solely on text; no sensory imagery or quick clips. “Preview the 4-step builder” link buried as text-only.
- **Signature Drops**: Cards have price chips but CTA just navigates to `/builder`; no “Add to box” inline or quick view. Approximate price vs. detail price duplicates info, causing cognitive load.
- **Community & Referral**: Stories resonate, yet design reads like corporate loyalty; lacks cultural cues (e.g., shisa nyama textures, WhatsApp share actions). Referral widget doesn’t highlight £ value.
- **Subscriptions**: Plans show price/feeds but no comparisons (cost per serving, spice level). Buttons labelled “Preview upcoming boxes” feel passive vs. “Lock this cadence”.
- **Final CTA Banner**: Tone is calm; should create urgency (“Deliveries close Tuesday 8PM”). Missing sticky CTA or floating builder summary as users scroll.
- **Footer**: Descriptive copy already uses “Lekker” but contact column could double as social proof (IG grid, WhatsApp share). Currently flat black without imagery.

### Conversion Risks
- Lack of real food photography in hero above the fold may lower appetite vs. Nando’s competitor benchmark.
- Pricing clarity (per person, shipping included) absent until deeper sections.
- Dual builder flows (bunny-first vs. curry-first) are not discoverable; users must visit `/builder` without context.

### Opportunities
- Use colour blocking with `#fab826`, `#ed908d`, `#80ccdd`, `#d7adcc`, `#c1d780`, and `#000000` to create stacked “festival blankets” instead of uniform white cards.
- Introduce interactive scrollers (e.g., TikTok-style prep clips, heat sliders) to mirror energetic South African dining.
- Surface WhatsApp/Share actions for diaspora gifting; align with community language already in footer.

## 2. South African Voice & Messaging Refresh

| Placement | New Copy | Why It Works |
| --- | --- | --- |
| Hero eyebrow | `Durban-born · Made for weeknight jol` | Signals SA slang (“jol”) and positions product as everyday ritual. |
| Hero headline | `Load a bunny, crank the curry, feed the laaities in 48 hours.` | Conversational cadence, references kids (“laaities”), keeps 48h promise. |
| Hero body | `Slow-simmered gravies, hot-from-the-oven loaves, carrot sambals, and pantry legends arrive mise en place. You plate, pour rooibos, and let the bunny chow flex happen under 20 minutes.` | Invokes sensory South African cues and emphasises speed. |
| Primary CTA | `Build my Durban box` | Personal, immediate action. |
| Secondary CTA | `See today's drops` | Adds urgency (today’s availability). |
| Mini-feature pills | `Restaurant fillings → Chef-grade potjie gravies`, `Bread & garnish options → Loaf, vetkoek, braai sides`, `Rewards with every drop → Spice locker points` | Aligns with authentic vocabulary. |
| Build Your Spread header | `Layer the loaf, then the gravy, then the braai extras.` | Mirrors new flow (bread-first vs curry-first). |
| Build Your Spread body | `Pick your base (soft loaf, vetkoek slider, gluten-free kota), then drag in garnishes, chutneys, and braai snacks so the table feels like Florida Road at golden hour.` | South African geography reference, action verbs (“drag”). |
| Ritual section title | `Dinner theatre for spice obsessives & Durban dreamers.` (keep) + add lead-in sentence: `Every kit drops with QR prep films, amapiano playlists, and masala boosters so you can host like an aunty.` | Adds cultural touches. |
| Signature Drops intro | `Limited drops inspired by Grey Street queues. Prices show box total + serves.` | Clarifies pricing and roots. |
| Loyalty headline | `Loyalty that tastes like home — chef drops, supper clubs, story swaps.` (keep) + add subline: `Every delivery loads 500 points into your Spice Locker for samoosa refills or delivery upgrades.` | Clarifies value. |
| Referral CTA | `Drop your code on WhatsApp` | Aligns with diaspora sharing behaviour. |
| Subscription headline | `Choose the cadence that suits your fam.` + support copy: `Show cost per serve, spice level, delivery perks inside each tile.` | Encourages price transparency. |
| Final CTA headline | `Orders lock Tuesday, deliveries land by Friday braai-time.` | Creates urgency anchored to SA weekend culture. |

Additional microcopy ideas:
- Use isiZulu “hawu”, “yebo”, or Afrikaans “lekker” sparingly inside testimonials to keep authenticity without caricature.
- Add ticker or badge: `Next braai run closes in 2h 17m` to push urgency.

## 3. Visual & Interaction Enhancements

### Colour Blocking & Texture
- **Hero split**: Left column stays warm neutral; right column becomes stacked colour bands: `#fab826` (curry yellow) for price badge, `#ed908d` overlay gradient on hero photography, `#000000` stroke to retain brand outline style.
- **Signature drops**: Alternate backgrounds using `#d7adcc`, `#80ccdd`, `#c1d780` to create “market stall” rhythm while maintaining `border-black`. Let each card pick a secondary accent for the price pill.
- **Community + referral**: Use deep charcoal `#000000` background with neon `#fab826` typography to mimic shisa nyama signage; add subtle grain texture (CSS linear-gradient + background-image noise PNG).

### Layout & Interaction
- **Sticky action rail**: Introduce a bottom-right floating `Build my Durban box` pill with cart count + savings. When scrolling past hero, the rail switches accent color depending on section (e.g., curry yellow, seafoam blue).
- **Hero motion**: Add auto-playing muted clip (5s loop) showing curry pour/loaf assembly using `next/video` or `Image` with GIF. Provide play/pause for accessibility.
- **Drop cards**: Replace static “Build this drop” text with CTA button that reveals mini modal (ingredients, price per person, add to builder). Use subtle tilt/scale on hover (transform: rotateX(3deg)).
- **Builder teaser**: Add horizontal stepper preview (Step 1 Bunny, Step 2 Curry, Step 3 Garnish, Step 4 Delivery). Each step tile shares iconography (line art from `components/icons`) and changes background on hover.
- **Testimonials**: Turn cards into swipeable carousel with avatars + voice notes (simulate WhatsApp). Add audio icon and `Play 0:12` microcopy.
- **Subscriptions**: Use comparative table view on desktop with `sticky` column for “Our pick” and embed spice level chips (Mild/Medium/Fire) using `#ed908d` for heat indicator.
- **Footer**: Expand into two-row layout: top row full-bleed image strip of food photography tinted with brand gradients; bottom row includes contact + social icons + WhatsApp “Chat to the Bunny crew”.

## 4. Dual Builder Flow Concept

### Flow A — Start with Bunny (Bread/Base First)
1. **Step picker**: Split hero CTA into toggle tabs `Bunny-first` (default) vs `Curry-first`. Selected tab animates with `#fab826` underline.
2. **Step 1: Choose your loaf**  
   - Grid of loaf cards (soft loaf, vetkoek slider, gluten-free kota) showing price per loaf, servings, recommended spice level.  
   - Each card has slider to select quantity (1–4) and microcopy like “Feeds 2 hungry okes”.
3. **Step 2: Load a curry**  
   - Once loaf is selected, corresponding curry matches appear (beef, lamb, bean, chicken).  
   - Use stacked cards with droplet heat meter (three dots filled using `#ed908d`).  
   - Show “Pairs with your loaf” tags using `#d7adcc`.
4. **Step 3: Add garnishes & braai extras**  
   - Masonry layout mixing sides/drinks. Quick add chips use `+` button.  
   - Live preview panel summarises loaf + curry + sides with running total and prep time.
5. **Step 4: Delivery cadence**  
   - Inline Stepper from `components/checkout/checkout-stepper.tsx` reused to pick once-off vs subscription; highlight savings per cadence.

### Flow B — Start with Curry (Protein/Heat First)
1. **Step picker**: When user selects `Curry-first`, hero background shifts to `#ed908d` gradient with steam illustration to signal heat-driven path.
2. **Step 1: Pick your gravy**  
   - Carousel of curry tiles sorted by protein; each tile shows video loop of plating + chips for `Heat`, `Prep`, `Best with`.  
   - Add “Chef recommends” badges referencing real Durban eateries.
3. **Step 2: Match a bunny base**  
   - After curry selection, recommended breads animate into view.  
   - Provide “Split loaf?” toggle for half-half combos.  
   - Display price per serving prominently.
4. **Step 3: Boost with sides & drinks**  
   - Introduce “Durban Pantry Queue” vertical timeline where users drag items into their box; timeline uses `#80ccdd` background and black stroke icons.
5. **Step 4: Schedule & share**  
   - Show delivery slots (48h promise) plus WhatsApp share tile to invite friends to the same drop.  

### Shared Innovations
- **Progress pill** anchored to top-right displays `Step 2 of 4 • 64% Durban-ready` with gradient fill.  
- **Contextual storytelling**: Each step surfaces a snippet (audio/quote) from Durban aunty giving tip (“Let the gravy rest, bru”).  
- **Performance**: Lazy-load step data; re-use `store/builder-store.ts` to manage state across toggles; ensure `builder` route can parse `?flow=bunny|curry` for deep linking from homepage.

## 5. Actionable Priorities

### Sprint-ready Wins
1. **Copy swap + CTA refresh**: Update hero, section headings, CTA labels per Section 2. Minimal engineering effort; immediately boosts South African tone.
2. **Urgency + sticky CTA**: Implement scroll-triggered floating `Build my Durban box` rail and order cutoff badge. Drives conversion without major redesign.
3. **Price clarity**: Add `per serve` text and shipping note inside drop/subscription cards; reuse existing data fields.
4. **Referral WhatsApp CTA**: Add `Button variant="outline"` linking to `https://wa.me/?text=...` plus copy updates to highlight £ value.

### Medium Lifts
1. **Hero media upgrade**: Shoot short-form clip or compile hero animation; integrate with `next/video` to keep LCP under control via poster frame + lazy load.
2. **Colour-blocked sections**: Update container backgrounds (`section-border-*` wrappers) to rotate through palette; requires global CSS adjustments but retains layout.
3. **Signature drop quick-add modal**: Build `DropQuickView` component that taps into `builder-store` and surfaces price per serving, availability, add button.

### Larger Initiatives
1. **Dual builder toggle + deep links**: Add `flow` query param to `/builder` and design new toggle/timeline per Section 4. Requires UX + frontend/State updates.
2. **Interactive testimonials + loyalty audio**: Build swipeable carousel with audio waveform + Web Audio player; adds cultural richness but needs asset sourcing.
3. **Footer revamp with social proof strip**: Requires new photography + layout restructure.

