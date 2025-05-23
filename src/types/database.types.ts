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
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string | null
          phone: string | null
          stripe_customer_id: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          name?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          metadata?: Json
        }
      }
      addresses: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          customer_id: string
          type: string
          line1: string
          line2: string | null
          city: string
          state: string | null
          postal_code: string
          country: string
          is_default: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id: string
          type?: string
          line1: string
          line2?: string | null
          city: string
          state?: string | null
          postal_code: string
          country?: string
          is_default?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id?: string
          type?: string
          line1?: string
          line2?: string | null
          city?: string
          state?: string | null
          postal_code?: string
          country?: string
          is_default?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          customer_id: string
          stripe_session_id: string | null
          stripe_payment_intent_id: string | null
          status: string
          total_amount: number
          currency: string
          shipping_address_id: string | null
          billing_address_id: string | null
          tracking_number: string | null
          notes: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          status?: string
          total_amount: number
          currency?: string
          shipping_address_id?: string | null
          billing_address_id?: string | null
          tracking_number?: string | null
          notes?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id?: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          status?: string
          total_amount?: number
          currency?: string
          shipping_address_id?: string | null
          billing_address_id?: string | null
          tracking_number?: string | null
          notes?: string | null
          metadata?: Json
        }
      }
      scheduled_emails: {
        Row: {
          id: string
          created_at: string
          send_at: string
          customer_email: string
          customer_name: string | null
          email_type: string
          status: 'pending' | 'sent' | 'failed'
          metadata: Json
          order_id: string
          attempt_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          send_at: string
          customer_email: string
          customer_name?: string | null
          email_type: string
          status?: 'pending' | 'sent' | 'failed'
          metadata?: Json
          order_id: string
          attempt_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          send_at?: string
          customer_email?: string
          customer_name?: string | null
          email_type?: string
          status?: 'pending' | 'sent' | 'failed'
          metadata?: Json
          order_id?: string
          attempt_count?: number
        }
      }
      product_reviews: {
        Row: {
          id: string
          rating: number
          feedback: string | null
          flavour: string
          email: string | null
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          rating: number
          feedback?: string | null
          flavour: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          rating?: number
          feedback?: string | null
          flavour?: string
          email?: string | null
          name?: string | null
          created_at?: string
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