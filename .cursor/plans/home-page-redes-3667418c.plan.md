<!-- 3667418c-0030-4f67-8292-ae2e6f147c27 07c3fcad-23e6-4736-9d6a-260e994ddd49 -->
# Remove Borders from Colored Background Elements

## Overview

Remove black borders from boxes and cards that have brand color backgrounds (curry, green, blue, pink, coral) to make them feel lighter and less heavy.

## Elements to Update

### 1. Summary Panel (`components/builder/summary-panel.tsx`)

- **Curry section** (bunny filling): Remove border, keep curry background
- **Blue totals section**: Remove border, keep blue background

### 2. Curry Step (`components/builder/curry-step.tsx`)

- **Green chef note box**: Remove border, keep green background
- **Selected curry cards**: May need to adjust - currently has curry background on selected

### 3. Quantity Card (`components/builder/quantity-card.tsx`)

- **Selected state**: Remove border when green background is active

### 4. Stepper (`components/ui/stepper.tsx`)

- **Active steps** (curry background): Remove border
- **Completed steps** (green background): Remove border
- Keep border on inactive white steps

### 5. Home Page Sections (`app/page.tsx`)

- Review any colored badge/pill elements that may feel heavy

## Design Rule

- **Colored backgrounds** (brand colors): NO black border
- **White/transparent backgrounds**: KEEP black border for definition

### To-dos

- [ ] Update globals.css to set white background and remove glassmorphism utilities
- [ ] Redesign hero section with solid white background, black border, and curry accent stripe
- [ ] Update all remaining sections with solid backgrounds, black borders, and brand color accents
- [ ] Remove transparency from all card components and apply solid styling
- [ ] Remove borders from colored sections in summary panel
- [ ] Remove borders from colored elements in curry step
- [ ] Remove borders from colored selected state in quantity cards
- [ ] Remove borders from active/completed colored steps