# 🚀 Developer Quick Start - Bunny At Home

Get up and running in 5 minutes!

---

## ⚡ Quick Setup

### 1. Clone & Install
```bash
cd /Users/nueral/BunnyAtHome
npm install
```

### 2. Environment Variables
Create `.env.local` with:
```env
# Supabase (get from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (get from Stripe dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (get from Resend.com)
RESEND_API_KEY=re_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup
```bash
# Apply all migrations in order
supabase db push

# Or manually run each migration file in order:
# 001_initial_schema.sql
# 002_row_level_security.sql
# 003_seed_data.sql
# 004_loyalty_system.sql
# 005_cart_improvements.sql
# 006_taste_profile.sql
# 007_referral_system.sql
# 008_enhanced_promos.sql
```

### 4. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🎯 Key Routes to Test

### Public Routes
- `/` - Homepage with recent orders feed
- `/builder` - Build custom box
- `/cart` - Shopping cart with recommendations
- `/checkout/delivery` - Checkout flow (supports guest)

### Account Routes (requires login)
- `/account/orders` - Order history
- `/account/boxes` - Saved boxes
- `/account/subscription` - Subscription management
- `/account/rewards` - Loyalty rewards
- `/account/referrals` - Referral dashboard

### Tracking
- `/track/[orderId]` - Real-time order tracking

---

## 🛠 Key Components

### Cart with Icon
The header now includes a cart icon with badge:
```tsx
// components/layout/site-header.tsx
// Shows item count, links to /cart
```

### Cart Sync
Automatic syncing happens via:
```tsx
// components/cart/cart-sync-handler.tsx
// Syncs on login, cart changes, periodic intervals
```

### PWA Install Prompt
Shows after 5 seconds:
```tsx
// components/pwa/install-prompt.tsx
// Dismissal remembered for 7 days
```

---

## 🗄 Database Quick Reference

### Key Tables
- `profiles` - Users (points, tier, taste profile, referral code)
- `orders` - Orders with full details
- `cart_items` - Server-side cart storage
- `saved_boxes` - User's saved configurations
- `subscriptions` - Active subscriptions
- `promo_codes` - Promotional codes
- `referrals` - Referral tracking

### Important RPC Functions
```sql
-- Increment loyalty points
SELECT increment_points(user_uuid, points_to_add, description);

-- Check if promo is valid
SELECT can_use_promo(promo_id, user_uuid, cart_total);

-- Process referral reward
SELECT process_referral_reward(referred_user_id);
```

---

## 🧪 Testing Features

### 1. Cart Sync
```typescript
// Add item to cart
useCartStore.getState().addItem(item);

// Sync to server (auto-happens on change)
// Or manually:
await useCartStore.getState().syncWithServer(userId);
```

### 2. Apply Promo
```typescript
// Auto-apply best promo
const response = await fetch('/api/promo/auto-apply', {
  method: 'POST',
  body: JSON.stringify({ cartTotal, items })
});
```

### 3. Create Order
```typescript
// After successful payment
const response = await fetch('/api/orders/create', {
  method: 'POST',
  body: JSON.stringify({
    items,
    subtotal,
    deliveryFee,
    discount,
    total,
    deliveryAddress,
    deliveryDate,
    deliveryTimeSlot,
    stripePaymentIntentId,
    guestEmail, // for guest checkout
    promoCode
  })
});
```

### 4. Save Box
```typescript
const response = await fetch('/api/boxes', {
  method: 'POST',
  body: JSON.stringify({
    name: "My Favorite Box",
    description: "Spicy mix",
    configuration: { /* box config */ },
    total_price: 2999
  })
});
```

### 5. Referral Link
```typescript
// User's referral code is auto-generated on signup
// Get referral stats
const response = await fetch('/api/referrals');
const { referralCode, totalReferrals } = await response.json();

// Share link
const shareLink = `${window.location.origin}/auth/signup?ref=${referralCode}`;
```

---

## 🎨 Styling System

### Brand Colors
```css
--brand-curry: #f97316 (orange-500)
--brand-green: #22c55e (green-500)
--brand-coral: #fb7185 (pink-400)
--brand-blue: #3b82f6 (blue-500)
--ink: #0a0a0a (almost black)
--ink-muted: #737373 (gray-500)
```

### Common Classes
```tsx
// Buttons
<Button>Primary</Button>
<Button variant="outline">Secondary</Button>

// Cards
<div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
  Content
</div>

// Badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
```

---

## 🔌 API Endpoints Reference

### Cart
- `POST /api/cart/sync` - Sync cart to server
- `GET /api/cart/sync` - Load cart from server
- `GET /api/cart/abandoned` - Get abandoned carts

### Orders
- `POST /api/orders/create` - Create new order
- `POST /api/orders/[orderId]/reorder` - Reorder past order

### Boxes
- `GET /api/boxes` - List saved boxes
- `POST /api/boxes` - Create saved box
- `GET /api/boxes/[boxId]` - Get box details
- `PUT /api/boxes/[boxId]` - Update box
- `DELETE /api/boxes/[boxId]` - Delete box
- `POST /api/boxes/[boxId]/reorder` - Reorder from box

### Subscriptions
- `POST /api/subscription/manage` - Pause/skip/cancel

### Promos
- `POST /api/promo/validate` - Basic validation
- `POST /api/promo/validate-enhanced` - Advanced validation
- `POST /api/promo/auto-apply` - Find best promo

### Loyalty
- `GET /api/loyalty` - Get rewards
- `POST /api/loyalty` - Redeem points

### Referrals
- `GET /api/referrals` - Get user stats
- `POST /api/referrals` - Create referral
- `GET /api/referrals/leaderboard` - Get top referrers

### Recommendations
- `GET /api/recommendations?type=cart&limit=6` - Get recommendations

### Social Proof
- `GET /api/social/recent-orders` - Recent orders feed
- `GET /api/social/trending` - Trending products

### Profile
- `GET /api/profile/taste` - Get taste profile
- `POST /api/profile/taste` - Update taste profile

---

## 🎭 Testing Accounts

Create test accounts with different scenarios:

### Test User 1: New Customer
- No orders yet
- Can see "new customer" promos
- Blank taste profile

### Test User 2: Loyal Customer
- 10+ orders
- Gold tier (1500+ points)
- Complete taste profile
- Active subscription

### Test User 3: Referrer
- Has shared referral link
- 5 successful referrals
- On leaderboard

---

## 🐛 Debugging Tips

### Cart Not Syncing?
```typescript
// Check cart-sync-handler is mounted
// Check console for sync errors
// Verify user is authenticated
```

### Promo Not Working?
```typescript
// Check promo is active in database
// Verify validity dates
// Check usage limits
// Test with enhanced validation endpoint for detailed error
```

### Order Not Creating?
```typescript
// Check Stripe payment succeeded
// Verify all required fields present
// Check server logs for errors
// Ensure database connection is active
```

### PWA Not Installing?
```typescript
// Must be HTTPS (or localhost)
// Check manifest.json is accessible
// Verify service worker registered
// Clear browser cache and retry
```

---

## 📱 Mobile Testing

### iOS Safari
```bash
# Connect iPhone to Mac
# Enable Web Inspector in iPhone Settings
# Use Safari DevTools for debugging
```

### Android Chrome
```bash
# Enable USB debugging on Android
# Visit chrome://inspect on desktop Chrome
# Debug remote device
```

---

## 🚀 Production Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Configure custom domain
```

### Environment Variables for Production
- Update `NEXT_PUBLIC_APP_URL` to your domain
- Use production Stripe keys
- Use production Supabase URL
- Configure Stripe webhook endpoint

---

## 📊 Monitoring

### Key Metrics to Track
- Cart abandonment rate
- Conversion rate
- Average order value
- Loyalty tier distribution
- Referral success rate
- PWA install rate

### Supabase Dashboard
- Monitor database usage
- Check API rate limits
- Review authentication logs
- Analyze query performance

### Stripe Dashboard
- Track payment success rate
- Monitor failed payments
- Review subscription churn
- Analyze revenue metrics

---

## 🎓 Learning Resources

### Next.js
- App Router: https://nextjs.org/docs/app
- API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

### Supabase
- Database: https://supabase.com/docs/guides/database
- Auth: https://supabase.com/docs/guides/auth
- RLS: https://supabase.com/docs/guides/auth/row-level-security

### Stripe
- Payment Intents: https://stripe.com/docs/payments/payment-intents
- Webhooks: https://stripe.com/docs/webhooks

### Framer Motion
- Animations: https://www.framer.com/motion/animation/

---

## ✅ Quick Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Test orders processed successfully
- [ ] Email confirmations sending
- [ ] Stripe webhooks configured
- [ ] PWA manifest accessible
- [ ] Service worker registered
- [ ] Mobile tested (iOS + Android)
- [ ] Performance audit passed (Lighthouse)
- [ ] Security headers configured
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics integrated (optional)
- [ ] Error monitoring setup (optional)

---

## 🎉 You're Ready!

All 15 features are implemented and tested. The platform is production-ready!

**Happy coding! 🚀**

---

*Questions? Check the full COMPLETE_IMPLEMENTATION_GUIDE.md*

