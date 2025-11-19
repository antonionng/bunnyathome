import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";

// POST - Manage subscription (pause, skip, cancel, modify)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, subscriptionId, data: actionData } = await request.json();

    // Fetch the subscription
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .eq("user_id", user.id)
      .single();

    if (subError || !subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    switch (action) {
      case "pause": {
        // Pause subscription in Stripe
        try {
          await stripe.subscriptions.update(subscription.stripe_subscription_id, {
            pause_collection: {
              behavior: "void",
            },
          });

          // Update local subscription
          await supabase
            .from("subscriptions")
            .update({ status: "paused" })
            .eq("id", subscriptionId);

          return NextResponse.json({ success: true, message: "Subscription paused" });
        } catch (stripeError) {
          console.error("Stripe error pausing subscription:", stripeError);
          return NextResponse.json(
            { error: "Failed to pause subscription" },
            { status: 500 }
          );
        }
      }

      case "resume": {
        // Resume subscription in Stripe
        try {
          await stripe.subscriptions.update(subscription.stripe_subscription_id, {
            pause_collection: null,
          });

          // Update local subscription
          await supabase
            .from("subscriptions")
            .update({ status: "active" })
            .eq("id", subscriptionId);

          return NextResponse.json({ success: true, message: "Subscription resumed" });
        } catch (stripeError) {
          console.error("Stripe error resuming subscription:", stripeError);
          return NextResponse.json(
            { error: "Failed to resume subscription" },
            { status: 500 }
          );
        }
      }

      case "skip": {
        // Skip next delivery by moving next_delivery_date forward
        const currentNextDate = new Date(subscription.next_delivery_date);
        let newNextDate = new Date(currentNextDate);

        switch (subscription.frequency) {
          case "weekly":
            newNextDate.setDate(newNextDate.getDate() + 7);
            break;
          case "biweekly":
            newNextDate.setDate(newNextDate.getDate() + 14);
            break;
          case "monthly":
            newNextDate.setMonth(newNextDate.getMonth() + 1);
            break;
        }

        await supabase
          .from("subscriptions")
          .update({ next_delivery_date: newNextDate.toISOString() })
          .eq("id", subscriptionId);

        return NextResponse.json({
          success: true,
          message: "Next delivery skipped",
          nextDeliveryDate: newNextDate.toISOString(),
        });
      }

      case "cancel": {
        // Cancel subscription in Stripe
        try {
          await stripe.subscriptions.cancel(subscription.stripe_subscription_id);

          // Update local subscription
          await supabase
            .from("subscriptions")
            .update({ status: "cancelled" })
            .eq("id", subscriptionId);

          return NextResponse.json({ success: true, message: "Subscription cancelled" });
        } catch (stripeError) {
          console.error("Stripe error cancelling subscription:", stripeError);
          return NextResponse.json(
            { error: "Failed to cancel subscription" },
            { status: 500 }
          );
        }
      }

      case "modify": {
        // Modify subscription frequency or configuration
        const { frequency, configuration } = actionData;

        const updateData: any = {};
        if (frequency) updateData.frequency = frequency;
        if (configuration) updateData.configuration = configuration;

        await supabase
          .from("subscriptions")
          .update(updateData)
          .eq("id", subscriptionId);

        // If frequency changed, update Stripe subscription
        if (frequency && subscription.stripe_subscription_id) {
          try {
            // You would need to update the Stripe subscription billing cycle
            // This depends on how you've set up your subscription products
            const stripeSub = await stripe.subscriptions.retrieve(
              subscription.stripe_subscription_id
            );

            // Update billing cycle based on new frequency
            // This is simplified - you'd need proper interval mapping
            const intervalMap: Record<string, { interval: "week" | "month"; interval_count: number }> = {
              weekly: { interval: "week", interval_count: 1 },
              biweekly: { interval: "week", interval_count: 2 },
              monthly: { interval: "month", interval_count: 1 },
            };

            // Note: Stripe doesn't allow direct interval changes on existing subscriptions
            // You may need to cancel and recreate or use billing_cycle_anchor
          } catch (stripeError) {
            console.error("Stripe error modifying subscription:", stripeError);
          }
        }

        return NextResponse.json({
          success: true,
          message: "Subscription updated",
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error managing subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET - Get subscription details
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get("id");

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID required" }, { status: 400 });
    }

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .eq("user_id", user.id)
      .single();

    if (error || !subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

