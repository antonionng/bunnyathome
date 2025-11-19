import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);

        // Check if order already exists
        const { data: existingOrder } = await supabase
          .from("orders")
          .select("id, status")
          .eq("stripe_payment_intent_id", paymentIntent.id)
          .single();

        if (existingOrder) {
          // Order exists, just update status if needed
          if (existingOrder.status !== "confirmed") {
            const { error } = await supabase
              .from("orders")
              .update({ status: "confirmed" })
              .eq("stripe_payment_intent_id", paymentIntent.id);

            if (error) {
              console.error("Error updating order:", error);
            }
          }
        } else {
          // Order doesn't exist yet (shouldn't happen but handle as backup)
          console.warn("Order not found for payment intent:", paymentIntent.id);
          // The order should have been created by the payment page
          // This is just a safety net - log for investigation
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", paymentIntent.id);

        // Update order status
        const { error } = await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        if (error) {
          console.error("Error updating order:", error);
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription created:", subscription.id);

        // Handle subscription creation
        // You would save this to your subscriptions table
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", subscription.id);

        // Update subscription status
        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            next_delivery_date: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Error updating subscription:", error);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription cancelled:", subscription.id);

        // Update subscription status
        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Error updating subscription:", error);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}



