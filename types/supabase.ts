export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comparison_pairs: {
        Row: {
          created_at: string
          id: number
          image_1: number
          image_2: number
          survey: number
        }
        Insert: {
          created_at?: string
          id?: number
          image_1: number
          image_2: number
          survey: number
        }
        Update: {
          created_at?: string
          id?: number
          image_1?: number
          image_2?: number
          survey?: number
        }
        Relationships: [
          {
            foreignKeyName: "pair_comparisons_image_1_fkey"
            columns: ["image_1"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pair_comparisons_image_2_fkey"
            columns: ["image_2"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pair_comparisons_survey_fkey"
            columns: ["survey"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          created_at: string
          id: number
          metadata: Json | null
          path: string
          survey: number
        }
        Insert: {
          created_at?: string
          id?: number
          metadata?: Json | null
          path: string
          survey: number
        }
        Update: {
          created_at?: string
          id?: number
          metadata?: Json | null
          path?: string
          survey?: number
        }
        Relationships: [
          {
            foreignKeyName: "images_survey_fkey"
            columns: ["survey"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      participations: {
        Row: {
          created_at: string
          finished: string | null
          id: number
          started: string | null
          survey: number
          user: string
        }
        Insert: {
          created_at?: string
          finished?: string | null
          id?: number
          started?: string | null
          survey: number
          user: string
        }
        Update: {
          created_at?: string
          finished?: string | null
          id?: number
          started?: string | null
          survey?: number
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_users_survey_fkey"
            columns: ["survey"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_users_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pwc_results: {
        Row: {
          choice: number
          created_at: string
          id: number
          pair: number
          time_taken: number
          user: string
        }
        Insert: {
          choice: number
          created_at?: string
          id?: number
          pair: number
          time_taken: number
          user: string
        }
        Update: {
          choice?: number
          created_at?: string
          id?: number
          pair?: number
          time_taken?: number
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "pwc_results_choice_fkey"
            columns: ["choice"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pwc_results_pair_fkey"
            columns: ["pair"]
            isOneToOne: false
            referencedRelation: "comparison_pairs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pwc_results_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaires: {
        Row: {
          additional_features: string | null
          background: number
          centering: number
          created_at: string
          eyes: number
          face_orientation: number
          gaze: number
          id: number
          lighting: number
          occluded: number
          self_observation: number
          sharpness: number
          smile: number
          user: string
        }
        Insert: {
          additional_features?: string | null
          background: number
          centering: number
          created_at?: string
          eyes: number
          face_orientation: number
          gaze: number
          id?: number
          lighting: number
          occluded: number
          self_observation: number
          sharpness: number
          smile: number
          user?: string
        }
        Update: {
          additional_features?: string | null
          background?: number
          centering?: number
          created_at?: string
          eyes?: number
          face_orientation?: number
          gaze?: number
          id?: number
          lighting?: number
          occluded?: number
          self_observation?: number
          sharpness?: number
          smile?: number
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaires_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          created_at: string
          email: string
          id: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          verified?: boolean
        }
        Relationships: []
      }
      surveys: {
        Row: {
          created_at: string
          id: number
          image_count: number | null
          participant_count: number | null
          public_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          image_count?: number | null
          participant_count?: number | null
          public_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          image_count?: number | null
          participant_count?: number | null
          public_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          admin: boolean
          created_at: string
          id: string
          name: string
        }
        Insert: {
          admin?: boolean
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          admin?: boolean
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
