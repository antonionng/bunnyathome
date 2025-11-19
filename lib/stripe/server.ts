import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

export async function createPaymentIntent(amount: number, metadata?: Record<string, string>) {
  return await stripe.paymentIntents.create({
    amount,
    currency: "gbp",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  });
}

export async function createSubscription(
  customerId: string,
  priceId: string,
  metadata?: Record<string, string>
) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
    metadata,
  });
}



