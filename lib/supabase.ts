import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://hsjiurhyorhqudckpsrg.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzaml1cmh5b3JocXVkY2twc3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MDg3NzAsImV4cCI6MjA2OTA4NDc3MH0.DLjplhDm209TrrR15EGxBxIYIVJfucHtCemhgsXElVc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: "vendor" | "supplier" | "admin"
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: "vendor" | "supplier" | "admin"
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "vendor" | "supplier" | "admin"
          created_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          business_name: string
          address: string
          phone: string
          fssai_number: string
          fssai_doc_url: string | null
          logo_url: string | null
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id: string
          business_name: string
          address: string
          phone: string
          fssai_number: string
          fssai_doc_url?: string | null
          logo_url?: string | null
          is_verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          business_name?: string
          address?: string
          phone?: string
          fssai_number?: string
          fssai_doc_url?: string | null
          logo_url?: string | null
          is_verified?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          category: "vegetables" | "oil" | "flour" | "spices"
          image_url: string | null
          stock: number
          supplier_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          category: "vegetables" | "oil" | "flour" | "spices"
          image_url?: string | null
          stock?: number
          supplier_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          category?: "vegetables" | "oil" | "flour" | "spices"
          image_url?: string | null
          stock?: number
          supplier_id?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          vendor_id: string
          total_price: number
          status: "pending" | "accepted" | "out_for_delivery" | "delivered"
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          total_price: number
          status?: "pending" | "accepted" | "out_for_delivery" | "delivered"
          created_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          total_price?: number
          status?: "pending" | "accepted" | "out_for_delivery" | "delivered"
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          vendor_id: string
          supplier_id: string
          order_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          supplier_id: string
          order_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          supplier_id?: string
          order_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      complaints: {
        Row: {
          id: string
          vendor_id: string
          supplier_id: string
          message: string
          status: "pending" | "resolved" | "dismissed"
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          supplier_id: string
          message: string
          status?: "pending" | "resolved" | "dismissed"
          created_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          supplier_id?: string
          message?: string
          status?: "pending" | "resolved" | "dismissed"
          created_at?: string
        }
      }
    }
  }
}
