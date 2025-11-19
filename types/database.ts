// Generated types from Supabase
// Run: npx supabase gen types typescript --project-id <project-id> > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          points_balance: number
          referral_code: string
          preferred_name: string | null
          dietary_preferences: string | null
          spice_level: number
          notification_preferences: Json
          communication_preferences: Json
          timezone: string
          language: string
          two_factor_enabled: boolean
          two_factor_secret: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          points_balance?: number
          referral_code: string
          preferred_name?: string | null
          dietary_preferences?: string | null
          spice_level?: number
          notification_preferences?: Json
          communication_preferences?: Json
          timezone?: string
          language?: string
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          points_balance?: number
          referral_code?: string
          preferred_name?: string | null
          dietary_preferences?: string | null
          spice_level?: number
          notification_preferences?: Json
          communication_preferences?: Json
          timezone?: string
          language?: string
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          line1: string
          line2: string | null
          city: string
          postcode: string
          is_default: boolean
          delivery_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          line1: string
          line2?: string | null
          city: string
          postcode: string
          is_default?: boolean
          delivery_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          line1?: string
          line2?: string | null
          city?: string
          postcode?: string
          is_default?: boolean
          delivery_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_boxes: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          configuration: Json
          total_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          configuration: Json
          total_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          configuration?: Json
          total_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: string
          items: Json
          subtotal: number
          delivery_fee: number
          discount: number
          total: number
          stripe_payment_intent_id: string | null
          delivery_address: Json
          delivery_date: string
          delivery_time_slot: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status: string
          items: Json
          subtotal: number
          delivery_fee: number
          discount: number
          total: number
          stripe_payment_intent_id?: string | null
          delivery_address: Json
          delivery_date: string
          delivery_time_slot: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: string
          items?: Json
          subtotal?: number
          delivery_fee?: number
          discount?: number
          total?: number
          stripe_payment_intent_id?: string | null
          delivery_address?: Json
          delivery_date?: string
          delivery_time_slot?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          status: string
          plan_type: string
          frequency: string
          next_delivery_date: string
          configuration: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          status: string
          plan_type: string
          frequency: string
          next_delivery_date: string
          configuration: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          status?: string
          plan_type?: string
          frequency?: string
          next_delivery_date?: string
          configuration?: Json
          created_at?: string
          updated_at?: string
        }
      }
      promo_codes: {
        Row: {
          id: string
          code: string
          discount_type: string
          discount_value: number
          valid_from: string
          valid_until: string
          max_uses: number
          current_uses: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_type: string
          discount_value: number
          valid_from: string
          valid_until: string
          max_uses: number
          current_uses?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_type?: string
          discount_value?: number
          valid_from?: string
          valid_until?: string
          max_uses?: number
          current_uses?: number
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          cart_data: Json
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cart_data: Json
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cart_data?: Json
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}



