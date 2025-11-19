# 🚀 Quick Start Guide

## Get Your Checkout Flow Running in 10 Minutes

### Step 1: Install Dependencies ✅
Already done! All packages are installed.

### Step 2: Set Up Supabase (5 minutes)

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Choose a name, database password, and region
   - Wait for project to be ready

2. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy:
     - `Project URL`
     - `anon/public` key
     - `service_role` key (keep secret!)

3. **Run Database Migrations**
   - Go to SQL Editor in Supabase
   - Copy and paste `supabase/migrations/001_initial_schema.sql`
   - Click "Run"
   - Repeat for `002_row_level_security.sql`
   - Repeat for `003_seed_data.sql`

### Step 3: Set Up Stripe (3 minutes)

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Sign up (or sign in)
   - Stay in Test Mode

2. **Get API Keys**
   - Go to Developers → API keys
   - Copy:
     - Publishable key (starts with `pk_test_`)
     - Secret key (starts with `sk_test_`)

3. **Set Up Webhook** (Optional for now)
   - Go to Developers → Webhooks
   - Add endpoint: `http://localhost:3000/api/stripe/webhooks`
   - Select events: `payment_intent.*`, `customer.subscription.*`
   - Copy webhook secret (starts with `whsec_`)

### Step 4: Configure Environment (2 minutes)

Create `.env.local` in the project root:

```env
# Supabase (from Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (from Step 3)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Resend (Optional for now)
RESEND_API_KEY=re_your_key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 5: Run the App! 🎉

```bash
npm run dev
```

Open http://localhost:3000

## 🎯 Test the Complete Flow

### 1. Build a Box
- Go to `/builder`
- Select curry, sides, drinks
- Click "Add to Cart"

### 2. View Cart
- Click "Cart" in header
- See your items
- Try a promo code: `WELCOME10`

### 3. Sign Up
- Click "Sign in" → "Sign up"
- Create an account
- You'll be redirected back

### 4. Checkout
- From cart, click "Proceed to Checkout"
- **Delivery**: Enter address (or select saved)
- **Schedule**: Pick a date and time slot
- **Payment**: Use Stripe test card: `4242 4242 4242 4242`
  - Expiry: Any future date
  - CVC: Any 3 digits
  - ZIP: Any 5 digits

### 5. Order Confirmation
- See your order number
- View delivery details
- Track your order

### 6. Account Dashboard
- Go to `/account`
- See your order in history
- Check loyalty points
- Try saving an address

## 🧪 Stripe Test Cards

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`
- **Insufficient Funds**: `4000 0000 0000 9995`

## 📦 What You Can Do Now

### ✅ Working Features
- Build custom boxes
- Add to cart with persistence
- Guest or authenticated checkout
- Save delivery addresses
- Schedule deliveries
- Process payments
- View order history
- Track orders
- Manage subscription
- Earn loyalty points
- Use referral codes

### 🔨 Next Steps (Optional)
1. **Email Templates**
   - Design with React Email
   - Send via Resend API

2. **Production Setup**
   - Create production Supabase project
   - Switch Stripe to live mode
   - Update environment variables

3. **Deploy**
   - Push to GitHub
   - Deploy to Vercel
   - Add domain

## 🐛 Troubleshooting

### Can't connect to Supabase?
- Check your `.env.local` file
- Ensure project URL and keys are correct
- Check project is active in Supabase dashboard

### Stripe payment not working?
- Use test card `4242 4242 4242 4242`
- Check publishable key starts with `pk_test_`
- Make sure you're in test mode

### Database errors?
- Check all migrations ran successfully
- Look at SQL Editor for errors
- Verify RLS policies are set up

### Cart not persisting?
- Check browser localStorage
- Try logging in
- Clear browser cache and try again

## 📚 Learn More

- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## 💬 Need Help?

1. Check `SETUP.md` for detailed setup
2. Read `IMPLEMENTATION_SUMMARY.md` for architecture
3. Review the code comments
4. Check the database schema in migrations

## 🎉 You're Ready!

Your complete e-commerce checkout system is now running. Start testing, customizing, and building your Durban bunny chow empire!

---

**Pro Tip**: Start with the builder at `/builder`, add items to cart, and experience the complete customer journey. It's all working! 🚀



