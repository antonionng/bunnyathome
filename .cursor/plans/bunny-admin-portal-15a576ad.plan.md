<!-- 15a576ad-c35e-4d72-b2b1-b5c915bec58c b7dcbb33-b03a-4135-b5d3-a0e30f98b674 -->
# Bunny Team Admin Portal Implementation Plan

## Database Schema Extensions

### New Tables Required

Create migration `010_admin_system.sql` with:

1. **admin_roles** - Role-based access control (super_admin, admin, operations, support)
2. **products** - Move from mock data to database with AI metadata tracking
3. **inventory** - Stock levels, reorder points, supplier info
4. **product_images** - AI-generated images with DALL-E metadata
5. **order_status_history** - Full audit trail for order changes
6. **ai_generations** - Track all AI operations (descriptions, images, box suggestions)
7. **admin_notifications** - Separate from user notifications
8. **ready_boxes** - AI-suggested box combinations based on products

### Schema Updates

- Add `is_admin` and `admin_role` to `profiles` table
- Add `stock_level`, `low_stock_threshold` to new products table
- Add `fulfilled_by`, `fulfillment_notes` to `orders` table

## AI Integration Layer

### Create `/lib/ai/` directory with:

**`openai-client.ts`** - OpenAI SDK initialization

- GPT-4 for product descriptions, box suggestions, customer insights
- DALL-E 3 for product images

**`product-generator.ts`** - Auto-generate product content

- Description generation with brand voice
- SEO-optimized copy
- Allergen detection from ingredients

**`image-generator.ts`** - Product & box image creation

- DALL-E prompts for Durban curry styling
- **Themed box images** - South African aesthetic blended with occasion themes (e.g., "Valentine's Love Birds" with SA styling + romantic elements, "Halloween Spice Night" with SA styling + spooky vibes)
- Product photography style consistency
- Image storage to Supabase Storage
- Fallback to placeholders

**`box-recommender.ts`** - AI box combinations

- Analyze menu items and create balanced boxes
- **Seasonal intelligence** - Summer braai boxes, Winter warmers, Spring fresh, Autumn harvest
- **Monthly themes** - Heritage month, Festive season, Rugby season, Back-to-school
- **Occasion-based** - Father's Day, Mother's Day, Valentine's, Holiday specials
- Consider dietary preferences, pricing tiers
- Generate marketing descriptions and social media copy
- Suggest optimal launch dates based on historical data

**`seasonal-analyzer.ts`** - Seasonal box drop planner

- Analyze current month/season and suggest themed boxes
- Track performance of previous seasonal drops
- Recommend menu item pairings based on season
- Generate content calendar for box launches

## Admin Portal Structure

### Route: `/admin` (protected, role-checked in middleware)

**Layout:** `/app/admin/layout.tsx`

- Sidebar navigation
- Quick actions
- Notification bell with real-time updates

**Dashboard:** `/app/admin/page.tsx`

- Revenue metrics (today, week, month)
- Active orders count by status
- Low stock alerts
- Recent customer activity
- Live order feed

### Products Management: `/app/admin/products/`

**`page.tsx`** - Products list with filters

- Category tabs, search, stock status
- Bulk actions, CSV export

**`[id]/page.tsx`** - Product editor

- AI description generator button
- AI image generator with prompt customization
- Inventory levels, pricing, allergens
- Availability toggle

**`new/page.tsx`** - New product wizard

- Step 1: Basic info
- Step 2: AI content generation
- Step 3: Inventory setup
- Step 4: Review & publish

### Inventory: `/app/admin/inventory/`

**`page.tsx`** - Inventory dashboard

- Stock levels grid
- Low stock warnings
- Reorder suggestions
- Supplier management

**Components:**

- Stock adjustment modal
- Batch import/export
- Inventory history viewer

### Orders Management: `/app/admin/orders/`

**`page.tsx`** - Orders table

- Filters: status, date range, customer
- Bulk status updates
- Export to CSV
- Print packing slips

**`[id]/page.tsx`** - Order details

- Customer info with quick actions
- Items breakdown
- Status timeline with notes
- Fulfillment checklist
- Print invoice/label

**Status management:**

- Drag-and-drop kanban view option
- Quick status change dropdown
- Auto-notifications on status change

### Customers: `/app/admin/customers/`

**`page.tsx`** - Customer directory

- Search by name, email, order #
- Loyalty tier badges
- Total spend, order count
- Last order date

**`[id]/page.tsx`** - Customer profile

- Full order history
- Addresses, preferences
- Points balance & transactions
- Referral stats
- Communication log
- Quick actions: email, refund, credit

### Ready Boxes (AI): `/app/admin/boxes/`

**`page.tsx`** - Curated box manager

- AI-suggested combinations
- Manual box builder
- Published boxes list

**`generate/page.tsx`** - AI box generator

- Select target price point
- Choose dietary filters
- AI creates balanced combinations
- Edit before publishing

### Notifications Center: `/app/admin/notifications/`

**`page.tsx`** - Notification hub

- Unread alerts
- Low stock warnings
- Failed payments
- Customer support queries
- Delivery issues

**Settings:**

- Configure alert thresholds
- Email/SMS preferences
- Team member assignments

## API Routes

### `/app/api/admin/`

**`products/`**

- `route.ts` - CRUD for products
- `generate-description/route.ts` - GPT-4 description
- `generate-image/route.ts` - DALL-E image
- `import/route.ts` - Bulk import CSV

**`inventory/`**

- `route.ts` - Stock adjustments
- `alerts/route.ts` - Low stock notifications

**`orders/`**

- `route.ts` - Admin order queries
- `[id]/status/route.ts` - Update order status
- `export/route.ts` - Export orders CSV
- `bulk-update/route.ts` - Batch operations

**`customers/`**

- `route.ts` - Customer search & list
- `[id]/route.ts` - Customer details
- `[id]/credit/route.ts` - Issue store credit
- `analytics/route.ts` - Customer insights

**`boxes/`**

- `generate/route.ts` - AI box suggestions
- `route.ts` - CRUD for ready boxes

**`notifications/`**

- `route.ts` - Admin notifications
- `mark-read/route.ts` - Update status
- `send/route.ts` - Manual notifications

**`analytics/`**

- `dashboard/route.ts` - Dashboard metrics
- `revenue/route.ts` - Financial reports
- `products/route.ts` - Product performance

## Components

### `/components/admin/`

**Layout:**

- `admin-sidebar.tsx` - Navigation with role-based menu
- `admin-header.tsx` - Search, notifications, user menu
- `admin-breadcrumbs.tsx` - Current location

**Dashboard:**

- `revenue-card.tsx` - Financial metrics
- `orders-by-status.tsx` - Status breakdown chart
- `low-stock-alert.tsx` - Inventory warnings
- `recent-activity-feed.tsx` - Live updates

**Products:**

- `product-form.tsx` - Create/edit product
- `ai-description-generator.tsx` - GPT-4 integration
- `ai-image-generator.tsx` - DALL-E integration
- `product-table.tsx` - Sortable, filterable table
- `inventory-adjuster.tsx` - Stock level controls

**Orders:**

- `order-table.tsx` - Advanced filtering
- `order-status-timeline.tsx` - Visual history
- `status-changer.tsx` - Quick status update
- `packing-slip.tsx` - Printable template

**Customers:**

- `customer-table.tsx` - Search & filter
- `customer-profile-card.tsx` - Overview
- `order-history-list.tsx` - Customer orders
- `customer-actions-menu.tsx` - Quick actions

**Boxes:**

- `box-builder.tsx` - Drag-and-drop builder
- `ai-box-suggestions.tsx` - Display AI combos
- `box-card.tsx` - Preview ready boxes

**Notifications:**

- `notification-bell.tsx` - Header dropdown
- `notification-list.tsx` - Feed with filters
- `notification-settings.tsx` - Preferences

**Shared:**

- `data-table.tsx` - Reusable table with sorting
- `export-button.tsx` - CSV export
- `date-range-picker.tsx` - Filter by dates
- `role-guard.tsx` - Component-level auth

## Middleware Updates

Update `middleware.ts`:

- Add `/admin/*` to protected routes
- Check `is_admin` flag and role
- Redirect non-admins to homepage

## Notification System

### Real-time (Supabase Realtime)

- Subscribe to order updates
- New customer signups
- Low stock alerts
- Payment failures

### External (Email/SMS)

- Use existing `/lib/email/send.ts`
- Add `/lib/sms/send.ts` (Twilio)
- Templates for common events
- Admin alert preferences

**Priority Events:**

- Critical: Payment failure, delivery issue
- High: Low stock, new order
- Medium: New customer, review posted
- Low: Daily summaries

## Types

### `/types/admin.ts`

- `AdminRole`, `AdminPermissions`
- `AdminNotification`, `NotificationPriority`
- `InventoryAdjustment`, `StockAlert`
- `OrderFilter`, `CustomerFilter`
- `AIGeneration`, `BoxSuggestion`

### `/types/product.ts`

- Move from `menu.ts` to product-focused types
- Add inventory fields
- AI generation metadata

## Implementation Priority

### Phase 1: Core Infrastructure (Essential)

1. Database migration with admin tables
2. Admin middleware & role checking
3. Basic admin layout & navigation
4. OpenAI integration setup

### Phase 2: Product & Inventory Management

5. Products CRUD with database
6. AI description & image generation
7. Inventory tracking & alerts
8. Product import/export

### Phase 3: Orders & Customers

9. Orders management interface
10. Order status workflow
11. Customer directory & profiles
12. Customer analytics

### Phase 4: Advanced Features

13. AI box generator
14. Notification system (real-time + external)
15. Analytics dashboard
16. Bulk operations

## Key Files to Create

- `supabase/migrations/010_admin_system.sql`
- `lib/ai/openai-client.ts`
- `lib/ai/product-generator.ts`
- `lib/ai/image-generator.ts`
- `lib/ai/box-recommender.ts`
- `lib/sms/send.ts`
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- All admin routes and components listed above

## Environment Variables Needed

```
OPENAI_API_KEY=sk-...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
ADMIN_EMAIL_ALERTS=admin@bunnyathome.com
```

### To-dos

- [ ] Create admin database schema migration with products, inventory, admin roles, AI tracking tables
- [ ] Update middleware to protect /admin routes with role-based access control
- [ ] Set up OpenAI client and create AI service modules for descriptions, images, and box recommendations
- [ ] Build admin portal layout with sidebar navigation, header, and notification bell
- [ ] Create product management interface with AI generation, inventory tracking, and CRUD operations
- [ ] Build inventory dashboard with stock alerts, adjustments, and low-stock notifications
- [ ] Create orders management with status workflow, bulk actions, and fulfillment tools
- [ ] Build customer directory with profiles, order history, and admin actions
- [ ] Implement AI-powered box combination generator based on menu items
- [ ] Build real-time notification system with in-app alerts and email/SMS integration
- [ ] Create admin dashboard with revenue metrics, order statistics, and business insights