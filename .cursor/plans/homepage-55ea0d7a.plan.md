<!-- 55ea0d7a-0c12-4295-8002-03e154fd6daf f357ed39-8759-48c6-9fe8-494abd2ebdfc -->
# Builder Flow & Design Improvements

## Problem

The builder currently mixes bunny fillings and family curries together, causing confusion. The flow needs to respect the user's entry point (bunny-first vs curry-first), use bolder design, add personality with animations, and provide lekker South African feedback when items are added.

## Plan

### 1. Separate Bunny & Curry Flows

- Create two distinct step sequences based on `?flow=bunny` or `?flow=curry` URL param
- **Bunny-first flow**: Bread/base selection → bunny fillings → sides/extras → drinks
- **Curry-first flow**: Family curry selection → bread/base → sides/extras → drinks
- Update builder store to handle separate product categories cleanly
- Show only relevant products at each step (no mixing bunny fillings with family curries)

### 2. Bold & Animated UI Refresh

- Add brand-colored section headers for each step (pink, blue, green, curry rotation)
- Use thicker borders (`border-3`), bigger shadows, rounded corners everywhere
- Animate product cards on hover (lift, scale, shadow)
- Add success animations when items are added (scale pulse, checkmark)
- Use emojis and icons throughout for visual interest

### 3. Interactive Chilli Heat Dial

- Design custom chilli-shaped heat meter (green → yellow → red gradient like attached image)
- Show dial on each curry card with draggable/clickable zones for Mild/Hot/Very Hot
- Animate the dial: glow effect on selection, scale pulse when changed
- Add spicy validation messages that get bolder with heat level:
- Mild: "Nice and gentle, boet"
- Hot: "Now we're talking! 🌶️"
- Very Hot: "EISH! You can handle the heat? 🔥"
- Visual feedback: dial changes color, emits particles/glow on Very Hot selection
- Dial gets "louder" (bigger, brighter, more animated) as heat increases

### 4. South African Tone & Validation

- Replace generic messages with SA slang: "Lekker choice!", "Sharp sharp!", "Eish, sold out", "Howzit looking?"
- Add toast notifications library (or build custom) for add-to-cart feedback
- Show contextual tips: "Need bread for your bunny filling, boet!" or "More gravy? Add another curry pot!"
- Use casual, warm copy throughout: "Load up the box", "Stack another?", "Fire up the spice"

### 5. Living & Breathing Interactions

- Pulse animation on "Add to box" buttons
- Counter increments with scale + color flash
- Floating success toasts with slide-in animation
- Progress indicator shows % complete with brand colors
- Sticky summary panel updates with smooth transitions

### 6. Homepage CTA Language

- Replace "Start with a bunny" / "Start with a curry" with more exciting options:
- "Load the loaf first 🥖" vs "Crank the curry first 🍲"
- Or: "Build a bunny chow" vs "Cook a curry feast"
- Or: "Hollow the loaf" vs "Simmer the pot"

### To-dos

- [ ] Implement separate bunny-first and curry-first step logic based on URL param
- [ ] Filter products by flow type so bunny/curry categories don't mix
- [ ] Update builder UI with thicker borders, shadows, brand colors, emojis
- [ ] Add hover, add-to-cart, and transition animations throughout
- [ ] Build or integrate toast notification system for add-to-cart feedback
- [ ] Rewrite all builder copy with SA tone and personality
- [ ] Update homepage CTAs with more exciting language for dual flows