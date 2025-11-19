import { z } from "zod";

export const deliveryAddressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .regex(/^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i, "Please enter a valid UK postcode"),
  deliveryInstructions: z.string().optional(),
});

export const deliveryScheduleSchema = z.object({
  date: z.date({
    required_error: "Please select a delivery date",
  }),
  timeSlot: z.enum(["morning", "afternoon", "evening"], {
    required_error: "Please select a time slot",
  }),
});

export const guestCheckoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type DeliveryAddressFormData = z.infer<typeof deliveryAddressSchema>;
export type DeliveryScheduleFormData = z.infer<typeof deliveryScheduleSchema>;
export type GuestCheckoutFormData = z.infer<typeof guestCheckoutSchema>;



