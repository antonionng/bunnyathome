import twilio from "twilio";

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export interface SMSOptions {
  to: string;
  message: string;
  mediaUrl?: string[];
}

/**
 * Send SMS notification via Twilio
 */
export async function sendSMS(options: SMSOptions): Promise<boolean> {
  if (!twilioClient || !TWILIO_PHONE_NUMBER) {
    console.warn("Twilio not configured. SMS not sent.");
    return false;
  }

  try {
    // Format phone number to E.164 format if not already
    const toNumber = formatPhoneNumber(options.to);

    const messageData: any = {
      body: options.message,
      from: TWILIO_PHONE_NUMBER,
      to: toNumber,
    };

    if (options.mediaUrl && options.mediaUrl.length > 0) {
      messageData.mediaUrl = options.mediaUrl;
    }

    const result = await twilioClient.messages.create(messageData);

    console.log(`SMS sent successfully: ${result.sid}`);
    return true;
  } catch (error) {
    console.error("Failed to send SMS:", error);
    return false;
  }
}

/**
 * Format phone number to E.164 format
 * Assumes South African numbers starting with +27
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, "");

  // If starts with 0, replace with 27 (SA country code)
  if (cleaned.startsWith("0")) {
    cleaned = "27" + cleaned.substring(1);
  }

  // If doesn't start with country code, add 27
  if (!cleaned.startsWith("27")) {
    cleaned = "27" + cleaned;
  }

  return "+" + cleaned;
}

/**
 * Send order status update SMS
 */
export async function sendOrderStatusSMS(
  phoneNumber: string,
  orderNumber: string,
  status: string
): Promise<boolean> {
  const statusMessages: Record<string, string> = {
    confirmed: `Your Bunny At Home order #${orderNumber} has been confirmed! We're preparing your delicious Durban curry. Track: bunnyathome.com/track/${orderNumber}`,
    preparing: `Good news! Your order #${orderNumber} is being prepared with love. Estimated delivery soon.`,
    shipped: `Your curry's on the way! Order #${orderNumber} has been shipped. Track: bunnyathome.com/track/${orderNumber}`,
    delivered: `Enjoy your Bunny Chow! Order #${orderNumber} has been delivered. Rate your experience: bunnyathome.com/review/${orderNumber}`,
  };

  const message = statusMessages[status] || `Your order #${orderNumber} status: ${status}`;

  return sendSMS({
    to: phoneNumber,
    message,
  });
}

/**
 * Send admin alert SMS
 */
export async function sendAdminAlertSMS(
  phoneNumber: string,
  alertTitle: string,
  alertMessage: string
): Promise<boolean> {
  const message = `🚨 Bunny Admin Alert\n${alertTitle}\n${alertMessage}`;

  return sendSMS({
    to: phoneNumber,
    message,
  });
}

/**
 * Send promotional SMS
 */
export async function sendPromoSMS(
  phoneNumber: string,
  promoCode: string,
  discount: string,
  expiryDate: string
): Promise<boolean> {
  const message = `🎉 Bunny At Home Special!\nUse code ${promoCode} for ${discount} off your next order.\nValid until ${expiryDate}\nOrder: bunnyathome.com`;

  return sendSMS({
    to: phoneNumber,
    message,
  });
}

/**
 * Send bulk SMS (for marketing campaigns)
 */
export async function sendBulkSMS(
  phoneNumbers: string[],
  message: string
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const phoneNumber of phoneNumbers) {
    const success = await sendSMS({
      to: phoneNumber,
      message,
    });

    if (success) {
      sent++;
    } else {
      failed++;
    }

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return { sent, failed };
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): boolean {
  // Check if it's a valid South African number
  const cleaned = phone.replace(/\D/g, "");
  
  // Should be 10 digits (starting with 0) or 11 digits (starting with 27)
  if (cleaned.length === 10 && cleaned.startsWith("0")) {
    return true;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith("27")) {
    return true;
  }
  
  // Check for full E.164 format
  if (cleaned.length === 11 && phone.startsWith("+27")) {
    return true;
  }
  
  return false;
}

/**
 * Get SMS cost estimate
 */
export function estimateSMSCost(messageLength: number, recipients: number): number {
  // Twilio pricing: ~$0.05 per SMS (160 chars)
  // Messages over 160 chars are split into multiple
  const segments = Math.ceil(messageLength / 160);
  const costPerSegment = 5; // cents
  return segments * costPerSegment * recipients;
}

