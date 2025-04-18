export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
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
          initial: boolean
          started: string | null
          survey: number
          user: string
        }
        Insert: {
          created_at?: string
          finished?: string | null
          id?: number
          initial?: boolean
          started?: string | null
          survey: number
          user: string
        }
        Update: {
          created_at?: string
          finished?: string | null
          id?: number
          initial?: boolean
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
          image_1: number
          image_2: number
          survey: number
          time_taken: number
          user: string
        }
        Insert: {
          choice: number
          created_at?: string
          id?: number
          image_1: number
          image_2: number
          survey: number
          time_taken: number
          user: string
        }
        Update: {
          choice?: number
          created_at?: string
          id?: number
          image_1?: number
          image_2?: number
          survey?: number
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
            foreignKeyName: "pwc_results_image_1_fkey"
            columns: ["image_1"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pwc_results_image_2_fkey"
            columns: ["image_2"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pwc_results_survey_fkey"
            columns: ["survey"]
            isOneToOne: false
            referencedRelation: "surveys"
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
          feature_order: Json
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
          feature_order: Json
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
          feature_order?: Json
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
          locale: string | null
          verified: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          locale?: string | null
          verified?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          locale?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          created_at: string
          emails: string[]
          id: number
          images: string[] | null
          user: string
        }
        Insert: {
          created_at?: string
          emails: string[]
          id?: number
          images?: string[] | null
          user: string
        }
        Update: {
          created_at?: string
          emails?: string[]
          id?: number
          images?: string[] | null
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          created_at: string
          id: string
          locale: string
          name: string
          role: Database["public"]["Enums"]["roles"]
        }
        Insert: {
          created_at?: string
          id?: string
          locale?: string
          name: string
          role?: Database["public"]["Enums"]["roles"]
        }
        Update: {
          created_at?: string
          id?: string
          locale?: string
          name?: string
          role?: Database["public"]["Enums"]["roles"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_pwc_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          survey: number
          count: number
        }[]
      }
    }
    Enums: {
      roles: "admin" | "helper" | "participant"
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

