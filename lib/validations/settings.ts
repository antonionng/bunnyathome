import { z } from "zod";

// Email change validation
export const emailChangeSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
});

// Password change validation
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile update validation
export const profileUpdateSchema = z.object({
  full_name: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
  phone: z.string().regex(/^\+?[0-9\s\-()]+$/, "Please enter a valid phone number").optional(),
  preferred_name: z.string().max(50, "Preferred name is too long").optional(),
  dietary_preferences: z.string().max(500, "Dietary preferences are too long").optional(),
  spice_level: z.number().int().min(1).max(5).optional(),
});

// Notification preferences validation
export const notificationPreferencesSchema = z.object({
  order_updates: z.boolean(),
  marketing: z.boolean(),
  recipes: z.boolean(),
});

// Communication preferences validation
export const communicationPreferencesSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  whatsapp: z.boolean(),
});

// Avatar upload validation
export const avatarUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPEG, PNG, and WebP images are allowed"
    ),
});

// 2FA enable validation
export const twoFactorEnableSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits").regex(/^\d+$/, "Code must contain only numbers"),
});

// 2FA disable validation
export const twoFactorDisableSchema = z.object({
  password: z.string().min(1, "Password is required"),
  code: z.string().length(6, "Verification code must be 6 digits").regex(/^\d+$/, "Code must contain only numbers"),
});

// Account deletion validation
export const accountDeletionSchema = z.object({
  password: z.string().min(1, "Password is required"),
  confirmation: z.literal(true, {
    errorMap: () => ({ message: "You must confirm account deletion" }),
  }),
  code: z.string().optional(), // Optional 2FA code
});

// Timezone and language validation
export const localePreferencesSchema = z.object({
  timezone: z.string().optional(),
  language: z.enum(["en", "af", "zu"]).optional(),
});

// Combined settings update schema
export const settingsUpdateSchema = profileUpdateSchema
  .merge(localePreferencesSchema)
  .merge(
    z.object({
      notification_preferences: notificationPreferencesSchema.optional(),
      communication_preferences: communicationPreferencesSchema.optional(),
    })
  );

// Type exports
export type EmailChangeInput = z.infer<typeof emailChangeSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;
export type CommunicationPreferences = z.infer<typeof communicationPreferencesSchema>;
export type TwoFactorEnableInput = z.infer<typeof twoFactorEnableSchema>;
export type TwoFactorDisableInput = z.infer<typeof twoFactorDisableSchema>;
export type AccountDeletionInput = z.infer<typeof accountDeletionSchema>;
export type LocalePreferencesInput = z.infer<typeof localePreferencesSchema>;

