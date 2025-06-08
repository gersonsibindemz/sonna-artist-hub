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
      approvals: {
        Row: {
          analyst_id: string | null
          comments: string | null
          created_at: string | null
          id: string
          reviewed_at: string | null
          status: string | null
          track_id: string | null
        }
        Insert: {
          analyst_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          reviewed_at?: string | null
          status?: string | null
          track_id?: string | null
        }
        Update: {
          analyst_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          reviewed_at?: string | null
          status?: string | null
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approvals_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          account_type: string | null
          bio: string | null
          created_at: string
          genre: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string | null
          bio?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string | null
          bio?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      duplicate_notifications: {
        Row: {
          created_at: string | null
          details: Json | null
          external_id: string | null
          external_platform: string | null
          id: string
          similarity_score: number | null
          status: string | null
          track_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          external_id?: string | null
          external_platform?: string | null
          id?: string
          similarity_score?: number | null
          status?: string | null
          track_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          external_id?: string | null
          external_platform?: string | null
          id?: string
          similarity_score?: number | null
          status?: string | null
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "duplicate_notifications_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          subject: string
          user_email: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          subject: string
          user_email: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          subject?: string
          user_email?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          created_at: string | null
          error_message: string
          function_name: string
          id: string
        }
        Insert: {
          created_at?: string | null
          error_message: string
          function_name: string
          id?: string
        }
        Update: {
          created_at?: string | null
          error_message?: string
          function_name?: string
          id?: string
        }
        Relationships: []
      }
      platform_submissions: {
        Row: {
          id: string
          platform_id: string
          reviewed_at: string | null
          status: string | null
          streaming_url: string | null
          submitted_at: string | null
          track_id: string
        }
        Insert: {
          id?: string
          platform_id: string
          reviewed_at?: string | null
          status?: string | null
          streaming_url?: string | null
          submitted_at?: string | null
          track_id: string
        }
        Update: {
          id?: string
          platform_id?: string
          reviewed_at?: string | null
          status?: string | null
          streaming_url?: string | null
          submitted_at?: string | null
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_submissions_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "streaming_platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_submissions_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      streaming_platforms: {
        Row: {
          base_url: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
        }
        Insert: {
          base_url?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
        }
        Update: {
          base_url?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          additional_credits: string | null
          album: string | null
          album_notes: string | null
          artist_id: string
          bit_rate: number | null
          channels: string | null
          composer: string | null
          copyright_holder: string | null
          cover_art_url: string | null
          created_at: string
          duration: number | null
          extra_comments: string | null
          file_format: string | null
          file_url: string | null
          genre: string | null
          id: string
          isrc_code: string | null
          iswc_code: string | null
          language: string | null
          license_type: string | null
          lyricist: string | null
          lyrics: string | null
          pro_society: string | null
          publisher: string | null
          record_label: string | null
          recording_date: string | null
          release_country: string | null
          release_date: string | null
          sample_rate: number | null
          status: string | null
          tags: string[] | null
          title: string
          track_number: number | null
          track_type: string | null
          upc_ean_code: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          additional_credits?: string | null
          album?: string | null
          album_notes?: string | null
          artist_id: string
          bit_rate?: number | null
          channels?: string | null
          composer?: string | null
          copyright_holder?: string | null
          cover_art_url?: string | null
          created_at?: string
          duration?: number | null
          extra_comments?: string | null
          file_format?: string | null
          file_url?: string | null
          genre?: string | null
          id?: string
          isrc_code?: string | null
          iswc_code?: string | null
          language?: string | null
          license_type?: string | null
          lyricist?: string | null
          lyrics?: string | null
          pro_society?: string | null
          publisher?: string | null
          record_label?: string | null
          recording_date?: string | null
          release_country?: string | null
          release_date?: string | null
          sample_rate?: number | null
          status?: string | null
          tags?: string[] | null
          title: string
          track_number?: number | null
          track_type?: string | null
          upc_ean_code?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          additional_credits?: string | null
          album?: string | null
          album_notes?: string | null
          artist_id?: string
          bit_rate?: number | null
          channels?: string | null
          composer?: string | null
          copyright_holder?: string | null
          cover_art_url?: string | null
          created_at?: string
          duration?: number | null
          extra_comments?: string | null
          file_format?: string | null
          file_url?: string | null
          genre?: string | null
          id?: string
          isrc_code?: string | null
          iswc_code?: string | null
          language?: string | null
          license_type?: string | null
          lyricist?: string | null
          lyrics?: string | null
          pro_society?: string | null
          publisher?: string | null
          record_label?: string | null
          recording_date?: string | null
          release_country?: string | null
          release_date?: string | null
          sample_rate?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string
          track_number?: number | null
          track_type?: string | null
          upc_ean_code?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tracks_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          bio: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          postal_code: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_isrc_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_isrc_code_v2: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_iswc_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      send_welcome_email: {
        Args: { user_email?: string }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
