# BunnyAtHome Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account
- Stripe account
- Resend account

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once the project is created, go to **Project Settings** → **API**
3. Copy the following values:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

4. Run the SQL migrations in the Supabase SQL Editor:
   - Open `supabase/migrations/001_initial_schema.sql`
   - Copy and paste into SQL Editor
   - Execute the query

## Step 3: Set Up Stripe

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your test API keys from the **Developers** → **API keys** section
3. Copy:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)

4. Set up webhooks:
   - Go to **Developers** → **Webhooks**
   - Add endpoint: `https://your-domain.com/api/stripe/webhooks`
   - Select events: `payment_intent.succeeded`, `customer.subscription.*`
   - Copy the webhook signing secret (starts with `whsec_`)

## Step 4: Set Up Resend

1. Go to [resend.com](https://resend.com) and create an account
2. Get your API key from the dashboard
3. Verify your sending domain (or use onboarding domain for testing)

## Step 5: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Resend
RESEND_API_KEY=re_your_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 6: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 7: Test Stripe Webhooks Locally

Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

Login to Stripe:
```bash
stripe login
```

Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

The CLI will output a webhook signing secret. Update your `.env.local` with this value.

## Database Schema

The following tables will be created:

- `profiles` - User profiles with points and referral codes
- `addresses` - User delivery addresses
- `saved_boxes` - Custom box configurations
- `orders` - Order history and details
- `subscriptions` - Active subscriptions
- `promo_codes` - Promotional discount codes
- `cart_items` - Persistent cart storage

## Next Steps

1. Build your first box at `/builder`
2. Add items to cart
3. Complete checkout flow
4. View order in account dashboard
5. Test subscription management

## Troubleshooting

### Supabase Connection Issues
- Check that your Supabase URL and keys are correct
- Ensure your project is active (not paused)
- Check browser console for CORS errors

### Stripe Webhook Issues
- Make sure webhook secret is correct
- Check Stripe CLI is forwarding correctly
- Verify endpoint URL in Stripe dashboard

### Email Issues
- Verify your sending domain in Resend
- Check API key is correct
- Use onboarding domain for testing

## Production Deployment

1. Create production Supabase project
2. Switch Stripe to live mode
3. Update environment variables in Vercel
4. Configure production webhook URL in Stripe
5. Verify sending domain in Resend



