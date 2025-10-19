export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      community_messages: {
        Row: {
          content: string
          created_at: string
          flag_reason: string | null
          flag_severity: string | null
          flagged: boolean | null
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          flag_reason?: string | null
          flag_severity?: string | null
          flagged?: boolean | null
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          flag_reason?: string | null
          flag_severity?: string | null
          flagged?: boolean | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_community_messages_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      mood_entries: {
        Row: {
          created_at: string
          hydration_ml: number | null
          id: string
          location: string | null
          mood: number
          notes: string | null
          physical_activity_minutes: number | null
          screen_time_minutes: number | null
          sleep_hours: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          hydration_ml?: number | null
          id?: string
          location?: string | null
          mood: number
          notes?: string | null
          physical_activity_minutes?: number | null
          screen_time_minutes?: number | null
          sleep_hours?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          hydration_ml?: number | null
          id?: string
          location?: string | null
          mood?: number
          notes?: string | null
          physical_activity_minutes?: number | null
          screen_time_minutes?: number | null
          sleep_hours?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accessory: string | null
          bottom: string | null
          coins: number | null
          created_at: string
          current_streak: number | null
          display_name: string | null
          eye_color: string | null
          hair_color: string | null
          hairstyle: string | null
          id: string
          last_check_in: string | null
          longest_streak: number | null
          top: string | null
          total_check_ins: number | null
          user_id: string
        }
        Insert: {
          accessory?: string | null
          bottom?: string | null
          coins?: number | null
          created_at?: string
          current_streak?: number | null
          display_name?: string | null
          eye_color?: string | null
          hair_color?: string | null
          hairstyle?: string | null
          id?: string
          last_check_in?: string | null
          longest_streak?: number | null
          top?: string | null
          total_check_ins?: number | null
          user_id: string
        }
        Update: {
          accessory?: string | null
          bottom?: string | null
          coins?: number | null
          created_at?: string
          current_streak?: number | null
          display_name?: string | null
          eye_color?: string | null
          hair_color?: string | null
          hairstyle?: string | null
          id?: string
          last_check_in?: string | null
          longest_streak?: number | null
          top?: string | null
          total_check_ins?: number | null
          user_id?: string
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          icon: string
          id: string
          name: string
          price: number
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          icon: string
          id?: string
          name: string
          price: number
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      user_inventory: {
        Row: {
          id: string
          item_id: string
          purchased_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          item_id: string
          purchased_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          item_id?: string
          purchased_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_inventory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_profile: {
        Args: { profile_user_id: string }
        Returns: {
          display_name: string
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
