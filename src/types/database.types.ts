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