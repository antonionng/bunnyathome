import { Resend } from "resend";
import { render } from "@react-email/components";
import { OrderConfirmationEmail } from "./templates/order-confirmation";
import { AbandonedCartEmail } from "./templates/abandoned-cart";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: "BunnyAtHome <orders@bunnyathome.com>",
      to,
      subject,
      react,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

interface OrderConfirmationData {
  email: string;
  orderNumber: string;
  customerName: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
  };
  deliveryDate: string;
  deliveryTimeSlot: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  return sendEmail({
    to: data.email,
    subject: `Your BunnyAtHome order is confirmed! #${data.orderNumber}`,
    react: OrderConfirmationEmail(data),
  });
}

interface AbandonedCartData {
  email: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  cartUrl: string;
  promoCode?: string;
  promoDiscount?: number;
}

export async function sendAbandonedCartEmail(data: AbandonedCartData) {
  return sendEmail({
    to: data.email,
    subject: "You left something delicious behind! 🍛",
    react: AbandonedCartEmail(data),
  });
}

interface OrderStatusUpdateData {
  email: string;
  orderNumber: string;
  customerName: string;
  status: string;
  trackingUrl: string;
}

export async function sendOrderStatusUpdate(data: OrderStatusUpdateData) {
  const statusMessages: Record<string, string> = {
    confirmed: "Your order is confirmed!",
    preparing: "We're getting your order ready!",
    shipped: "Your order is on the way!",
    delivered: "Your order has been delivered!",
  };

  return sendEmail({
    to: data.email,
    subject: `Order Update: ${statusMessages[data.status] || "Status Update"} #${data.orderNumber}`,
    react: OrderConfirmationEmail(data as any), // Would create separate template
  });
}

