<!-- 1ad4dda1-6b04-473c-bd24-9e87b43b9515 d3338aa9-9963-42f4-b712-1c8d875c5849 -->
# Complete Customer Portal & Innovative Cart/Checkout Experience

## Phase 1: Complete Missing Integrations & Core Functionality

### 1.1 Payment & Order Flow Completion

- **Payment Intent Order Creation**: Update `app/checkout/payment/page.tsx` to create order in database after successful payment, not just redirect
- **Order Creation API Enhancement**: Modify `app/api/orders/create/route.ts` to handle guest orders, send confirmation emails, award loyalty points
- **Stripe Webhook Order Creation**: Add order creation logic in `app/api/stripe/webhooks/route.ts` for `payment_intent.succeeded` event
- **Subscription Payment Flow**: Create subscription payment intent endpoint that connects checkout subscription selection to actual Stripe subscription creation

### 1.2 Cart Sync & Persistence

- **Server Cart Sync**: Implement `app/api/cart/sync/route.ts` to properly merge local cart with server cart on login
- **Guest-to-User Cart Migration**: Add middleware logic to automatically sync guest cart when user logs in
- **Cart Recovery Email**: Create abandoned cart detection system and recovery email templates

### 1.3 Account Portal Backend Integration

- **Saved Boxes CRUD**: Add API routes for saving, loading, editing, and deleting custom box configurations in `app/api/boxes/*`
- **Reorder Functionality**: Add one-click reorder that loads saved box or past order directly into cart
- **Subscription Management Actions**: Implement pause, skip, cancel, and modify subscription endpoints
- **Address CRUD Completion**: Add edit and delete functionality to address management

### 1.4 Promo Code System Enhancement

- **Advanced Promo Validation**: Enhance `app/api/promo/validate/route.ts` with usage limits, user-specific codes, minimum order amounts
- **Auto-applied Promos**: Add system that automatically applies best available promo for user
- **Referral Code System**: Implement referral code tracking, rewards, and invitation system

## Phase 2: Smart Features & AI-Powered Enhancements

### 2.1 Intelligent Recommendations

- **Product Recommendations Engine**: Create recommendation system based on order history, popular combos, and user preferences
- **Smart Bundles**: Suggest complementary items (e.g., "People who ordered Chicken Bunny also added Pumpkin Fritters")
- **Personalized Homepage**: Show recommended boxes and items based on user's taste profile
- **Reorder Intelligence**: Smart suggestions for what to reorder based on time since last order

### 2.2 Predictive Features

- **Smart Delivery Scheduling**: Suggest delivery slots based on user's past preferences and availability patterns
- **Inventory-Aware Suggestions**: Recommend alternatives when items are low stock or unavailable
- **Price Drop Alerts**: Notify users when their favorite items go on sale
- **Subscription Optimization**: Suggest optimal frequency based on consumption patterns

### 2.3 Personalization Engine

- **Taste Profile Builder**: Quick questionnaire on signup to understand spice preferences, dietary restrictions, favorites
- **Adaptive Spice Recommendations**: Remember and suggest user's preferred spice levels
- **Favorite Items Quick Access**: Pin frequently ordered items for one-click addition
- **Custom Box Templates**: Auto-save user's ordering patterns as quick-order templates

## Phase 3: Engagement Features & Gamification

### 3.1 Loyalty & Rewards System

- **Points on Every Action**: Award points for orders, reviews, referrals, social shares, birthdays
- **Tiered Membership**: Bronze/Silver/Gold/Platinum tiers with increasing benefits
- **Achievements & Badges**: Unlock badges for milestones (First Order, Spice Master, Loyal Customer, etc.)
- **Progress Visualization**: Show progress to next tier/reward with animated progress bars
- **Points Redemption Store**: Dedicated page to redeem points for discounts, free items, exclusive perks

### 3.2 Social Proof & Community

- **Recent Orders Feed**: Show anonymized recent orders ("Someone in London just ordered...")
- **Popular Right Now**: Real-time trending items with "🔥 Hot" badges
- **Review System**: Add reviews and ratings to products with photo uploads
- **Share Your Box**: Generate beautiful shareable images of orders for social media
- **Referral Leaderboard**: Gamified referral competition with rewards

### 3.3 Micro-Interactions & Animations

- **Cart Animation**: Smooth "add to cart" animation with item flying into cart icon
- **Confetti on Order**: Celebration animation on successful order placement
- **Progress Indicators**: Animated checkout progress with completion percentages
- **Skeleton Loaders**: Beautiful loading states instead of spinners
- **Toast Notifications**: Rich, contextual notifications with actions (undo, view cart)
- **Hover Interactions**: Product cards with smooth image zoom and quick-view

## Phase 4: Advanced Cart & Checkout UX

### 4.1 Smart Cart Features

- **Cart Recommendations**: Show "Complete Your Box" suggestions in cart
- **Volume Discounts**: Display "Add 2 more items to save 10%" type prompts
- **Free Delivery Progress**: Visual bar showing progress to free delivery threshold
- **Save for Later**: Move items to wishlist without removing from cart
- **Share Cart**: Generate shareable cart links for group orders
- **Price Protection**: Lock in prices for 24 hours after adding to cart

### 4.2 Express Checkout Options

- **Guest Express Checkout**: Streamlined 2-step guest flow (details + payment)
- **One-Click Reorder**: Past orders appear with single-click checkout option
- **Apple/Google Pay Priority**: Prominent fast checkout buttons
- **Smart Address Autocomplete**: Google Places API for instant address filling
- **Saved Payment Methods**: Stripe payment method management for returning users
- **Quick Buy Buttons**: "Quick Order" on frequently purchased items

### 4.3 Checkout Optimization

- **Progress Saving**: Auto-save checkout progress, allow users to complete later
- **Error Recovery**: Smart error handling with inline fixes (address validation, card errors)
- **Alternative Payment Methods**: Add PayPal, Klarna, Apple Pay, Google Pay
- **Order Notes Templates**: Quick-select common delivery instructions
- **Delivery Calendar View**: Visual calendar for selecting delivery dates
- **Time Slot Availability**: Real-time availability display with popular slot indicators

## Phase 5: Real-Time Features & Live Updates

### 5.1 Live Order Tracking

- **Real-Time Status Updates**: WebSocket/Server-Sent Events for live order status changes
- **Interactive Tracking Map**: Show delivery driver location (if available)
- **Status Timeline**: Visual timeline with estimated times for each stage
- **Push Notifications**: Browser push notifications for order updates
- **SMS Updates**: Optional SMS notifications for key order milestones
- **Email Tracking**: Rich HTML emails with live tracking links

### 5.2 Inventory & Availability

- **Live Stock Indicators**: Show "Only 3 left!" type urgency indicators
- **Back-in-Stock Notifications**: Allow users to subscribe to item availability alerts
- **Waitlist System**: Join waitlist for sold-out items
- **Pre-Order System**: Allow pre-ordering for upcoming items/special drops

### 5.3 Dynamic Pricing & Offers

- **Flash Sales**: Time-limited offers with countdown timers
- **Happy Hour Pricing**: Special pricing during specific time windows
- **Dynamic Delivery Fees**: Surge pricing during peak times with transparent communication
- **Personalized Offers**: User-specific discounts based on behavior

## Phase 6: Performance & Polish

### 6.1 Optimistic UI Updates

- **Instant Cart Updates**: Update UI immediately, sync in background
- **Optimistic Navigation**: Pre-fetch next checkout steps
- **Offline Support**: Allow browsing and cart building offline, sync when online
- **Background Sync**: Automatically sync cart/preferences across devices

### 6.2 Advanced Loading States

- **Skeleton Screens**: Content-aware loading placeholders
- **Progressive Image Loading**: Blur-up effect for product images
- **Streaming SSR**: Stream page content as it loads
- **Prefetching**: Intelligently prefetch likely next pages

### 6.3 Micro-Interactions Polish

- **Haptic Feedback**: Subtle vibrations on mobile for actions
- **Sound Effects**: Optional subtle sounds for key actions
- **Smooth Transitions**: Page transitions with motion
- **Drag & Drop**: Reorder cart items by dragging
- **Swipe Actions**: Mobile swipe-to-delete in cart

## Phase 7: Analytics & Conversion Optimization

### 7.1 User Behavior Tracking

- **Event Tracking System**: Track all key user interactions
- **Funnel Analytics**: Understand drop-off points in checkout
- **Heatmaps**: Visual representation of user clicks and scrolls
- **Session Recording**: Understand user journey (with privacy controls)

### 7.2 A/B Testing Infrastructure

- **Feature Flags**: Toggle features for different user segments
- **A/B Testing Framework**: Test checkout flows, pricing displays, CTAs
- **Conversion Tracking**: Measure impact of each feature on conversion rate

### 7.3 Customer Insights Dashboard

- **User Lifetime Value**: Track and display CLV in admin view
- **Churn Prediction**: Identify at-risk customers for retention campaigns
- **Cohort Analysis**: Group users and analyze behavior patterns
- **Product Performance**: Which items drive most revenue/satisfaction

## Phase 8: Mobile Experience & PWA

### 8.1 Progressive Web App

- **PWA Manifest**: Make app installable on mobile devices
- **Service Worker**: Offline functionality and fast loading
- **App-Like Experience**: Native-feeling navigation and interactions
- **Home Screen Icon**: Custom app icon and splash screen

### 8.2 Mobile Optimization

- **Touch Gestures**: Swipe, pinch-to-zoom, pull-to-refresh
- **Mobile-First UI**: All components optimized for small screens
- **Quick Actions**: Bottom sheet for common actions
- **Camera Integration**: Take photos for reviews directly in app

## Phase 9: Customer Support & Help

### 9.1 In-App Support

- **Live Chat Widget**: Real-time support chat (could integrate Intercom/Crisp)
- **Help Center**: Searchable FAQ and help articles
- **Order Issues**: Quick resolution flows for common problems
- **Chatbot Assistant**: AI-powered chatbot for instant answers

### 9.2 Self-Service Tools

- **Order Modification**: Edit orders before preparation starts
- **Easy Returns/Refunds**: Streamlined return request process
- **Delivery Rescheduling**: Change delivery date/time easily
- **Issue Reporting**: Simple forms for quality issues with photo upload

## Phase 10: Additional Features & Polish

### 10.1 Gift & Social Features

- **Gift Cards**: Purchase and redeem gift cards
- **Gift Messaging**: Add personalized message to orders
- **Surprise Box**: Mystery box option with curated selections
- **Group Orders**: Split payment among multiple people

### 10.2 Dietary & Preferences

- **Allergen Filtering**: Filter products by dietary restrictions
- **Nutritional Information**: Display calories, ingredients, allergens
- **Meal Planning**: Weekly meal planning with bunny chow
- **Cooking Instructions**: Heating/serving suggestions

### 10.3 Marketing Integrations

- **Email Marketing**: Segmented email campaigns (using Resend + React Email)
- **SMS Marketing**: Order updates and promotional SMS
- **Social Media Integration**: Share orders, earn rewards for posts
- **Influencer Codes**: Special tracking codes for influencer partnerships

## Files to Create/Modify

### New API Routes

- `app/api/boxes/*` - Saved box management
- `app/api/subscription/manage/route.ts` - Subscription actions
- `app/api/recommendations/route.ts` - Product recommendations
- `app/api/loyalty/route.ts` - Points and rewards
- `app/api/tracking/route.ts` - Order tracking updates
- `app/api/reviews/route.ts` - Product reviews
- `app/api/notifications/route.ts` - Notification preferences

### New Components

- `components/recommendations/` - Recommendation cards and sections
- `components/loyalty/` - Points display, progress bars, badges
- `components/tracking/` - Live tracking visualizations
- `components/reviews/` - Review forms and displays
- `components/social/` - Social proof, recent orders feed
- `components/animations/` - Reusable animation components

### Enhanced Pages

- All checkout pages with optimistic updates
- All account pages with full backend integration
- Cart page with advanced features
- New pages: Rewards store, Help center, Reviews

### Database Additions

- New tables: `reviews`, `achievements`, `notifications`, `waitlists`, `gift_cards`
- Enhanced tables: Add fields for tracking, preferences, analytics

## Success Metrics

- Checkout completion rate > 80%
- Average order value increase by 25%
- Customer retention rate > 60%
- Time to checkout < 2 minutes
- Mobile conversion parity with desktop
- Customer satisfaction score > 4.5/5

### To-dos

- [ ] Complete payment flow to create orders in database and send confirmation emails
- [ ] Implement server cart sync and guest-to-user cart migration
- [ ] Build complete saved boxes system with CRUD operations and one-click reorder
- [ ] Implement subscription pause, skip, cancel, and modification actions
- [ ] Create intelligent product recommendation system based on user behavior and order history
- [ ] Build comprehensive loyalty program with points, tiers, achievements, and rewards store
- [ ] Add social proof elements: recent orders feed, trending items, reviews system
- [ ] Implement advanced cart features: recommendations, volume discounts, save for later
- [ ] Build streamlined guest checkout and one-click reorder flows
- [ ] Create real-time order tracking with status updates and notifications
- [ ] Build taste profile system and personalized recommendations
- [ ] Add polished animations, transitions, and micro-interactions throughout
- [ ] Implement referral code tracking, rewards, and leaderboard
- [ ] Enhance promo system with auto-apply, stacking rules, and advanced validation
- [ ] Convert to PWA with offline support and mobile-first optimizations