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
      ad_copy: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          lead_id: string | null
          objective: string | null
          platform: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          lead_id?: string | null
          objective?: string | null
          platform?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          lead_id?: string | null
          objective?: string | null
          platform?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_copy_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_copy_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_variants: {
        Row: {
          ad_copy_id: string | null
          body: string | null
          created_at: string
          cta: string | null
          headline: string | null
          id: string
          workspace_id: string
        }
        Insert: {
          ad_copy_id?: string | null
          body?: string | null
          created_at?: string
          cta?: string | null
          headline?: string | null
          id?: string
          workspace_id: string
        }
        Update: {
          ad_copy_id?: string | null
          body?: string | null
          created_at?: string
          cta?: string | null
          headline?: string | null
          id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_variants_ad_copy_id_fkey"
            columns: ["ad_copy_id"]
            isOneToOne: false
            referencedRelation: "ad_copy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_variants_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_runs: {
        Row: {
          agent: string
          cost_usd: number | null
          created_at: string
          duration_ms: number | null
          error: string | null
          id: string
          input: Json | null
          input_tokens: number | null
          lead_id: string | null
          model: string | null
          output: Json | null
          output_tokens: number | null
          status: string
          version: string | null
          workflow_run_id: string | null
          workspace_id: string
        }
        Insert: {
          agent: string
          cost_usd?: number | null
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          id?: string
          input?: Json | null
          input_tokens?: number | null
          lead_id?: string | null
          model?: string | null
          output?: Json | null
          output_tokens?: number | null
          status?: string
          version?: string | null
          workflow_run_id?: string | null
          workspace_id: string
        }
        Update: {
          agent?: string
          cost_usd?: number | null
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          id?: string
          input?: Json | null
          input_tokens?: number | null
          lead_id?: string | null
          model?: string | null
          output?: Json | null
          output_tokens?: number | null
          status?: string
          version?: string | null
          workflow_run_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_runs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_runs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          issues: Json | null
          lead_id: string | null
          model: string | null
          overall_score: number | null
          scores: Json | null
          summary: string | null
          updated_at: string
          url: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          issues?: Json | null
          lead_id?: string | null
          model?: string | null
          overall_score?: number | null
          scores?: Json | null
          summary?: string | null
          updated_at?: string
          url?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          issues?: Json | null
          lead_id?: string | null
          model?: string | null
          overall_score?: number | null
          scores?: Json | null
          summary?: string | null
          updated_at?: string
          url?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audits_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audits_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          comparison: Json | null
          created_at: string
          data: Json | null
          id: string
          lead_id: string | null
          name: string | null
          updated_at: string
          website: string | null
          workspace_id: string
        }
        Insert: {
          comparison?: Json | null
          created_at?: string
          data?: Json | null
          id?: string
          lead_id?: string | null
          name?: string | null
          updated_at?: string
          website?: string | null
          workspace_id: string
        }
        Update: {
          comparison?: Json | null
          created_at?: string
          data?: Json | null
          id?: string
          lead_id?: string | null
          name?: string | null
          updated_at?: string
          website?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitors_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitors_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      document_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          document_id: string
          embedding: string
          id: string
          namespace: string
          workspace_id: string
        }
        Insert: {
          chunk_index?: number
          content: string
          created_at?: string
          document_id: string
          embedding: string
          id?: string
          namespace: string
          workspace_id: string
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          document_id?: string
          embedding?: string
          id?: string
          namespace?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_chunks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string
          created_at: string
          id: string
          namespace: string
          title: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          namespace: string
          title: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          namespace?: string
          title?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequences: {
        Row: {
          created_at: string
          data: Json | null
          goal: string | null
          id: string
          lead_id: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          goal?: string | null
          id?: string
          lead_id?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          goal?: string | null
          id?: string
          lead_id?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_sequences_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sequences_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      email_steps: {
        Row: {
          body: string | null
          created_at: string
          delay_days: number
          id: string
          sequence_id: string | null
          step_index: number
          subject: string | null
          workspace_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          delay_days?: number
          id?: string
          sequence_id?: string | null
          step_index: number
          subject?: string | null
          workspace_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          delay_days?: number
          id?: string
          sequence_id?: string | null
          step_index?: number
          subject?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_steps_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          business_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          industry: string | null
          location: string | null
          notes: string | null
          source: string | null
          status: string
          updated_at: string
          website: string | null
          workspace_id: string
        }
        Insert: {
          business_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          location?: string | null
          notes?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          website?: string | null
          workspace_id: string
        }
        Update: {
          business_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          location?: string | null
          notes?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          website?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          content: Json | null
          created_at: string
          data: Json | null
          id: string
          lead_id: string | null
          pricing: Json | null
          status: string
          title: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          data?: Json | null
          id?: string
          lead_id?: string | null
          pricing?: Json | null
          status?: string
          title?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          data?: Json | null
          id?: string
          lead_id?: string | null
          pricing?: Json | null
          status?: string
          title?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          content: Json | null
          created_at: string
          data: Json | null
          id: string
          lead_id: string | null
          title: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          data?: Json | null
          id?: string
          lead_id?: string | null
          title?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          data?: Json | null
          id?: string
          lead_id?: string | null
          title?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_reports: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          lead_id: string | null
          model: string | null
          recommendations: Json | null
          score: number | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          lead_id?: string | null
          model?: string | null
          recommendations?: Json | null
          score?: number | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          lead_id?: string | null
          model?: string | null
          recommendations?: Json | null
          score?: number | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_reports_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_reports_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_runs: {
        Row: {
          context: Json
          created_at: string
          finished_at: string | null
          id: string
          lead_id: string | null
          started_at: string | null
          status: string
          workflow_id: string | null
          workspace_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          finished_at?: string | null
          id?: string
          lead_id?: string | null
          started_at?: string | null
          status?: string
          workflow_id?: string | null
          workspace_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          finished_at?: string | null
          id?: string
          lead_id?: string | null
          started_at?: string | null
          status?: string
          workflow_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_runs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          definition: Json
          id: string
          name: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          definition: Json
          id?: string
          name: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          definition?: Json
          id?: string
          name?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflows_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_document_chunks: {
        Args: {
          p_match_count?: number
          p_namespaces?: string[]
          p_query_embedding: string
          p_workspace_id: string
        }
        Returns: {
          content: string
          namespace: string
          similarity: number
        }[]
      }
      pgmq_delete: {
        Args: { msg_id: number; queue_name: string }
        Returns: boolean
      }
      pgmq_read: {
        Args: { qty: number; queue_name: string; vt: number }
        Returns: unknown[]
        SetofOptions: {
          from: "*"
          to: "message_record"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      pgmq_send: {
        Args: { delay?: number; msg: Json; queue_name: string }
        Returns: number
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

