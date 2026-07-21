// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      acr_patients: {
        Row: {
          attachments: Json | null
          background: string | null
          birth_date: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          registration_date: string | null
        }
        Insert: {
          attachments?: Json | null
          background?: string | null
          birth_date?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          registration_date?: string | null
        }
        Update: {
          attachments?: Json | null
          background?: string | null
          birth_date?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          registration_date?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          published_at: string | null
          slug: string
          title: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          slug: string
          title: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      classes: {
        Row: {
          capacity: number
          course: string
          created_at: string | null
          id: string
          name: string
          room: string | null
          semester: string
          shift: string | null
          year: string | null
        }
        Insert: {
          capacity?: number
          course: string
          created_at?: string | null
          id?: string
          name: string
          room?: string | null
          semester: string
          shift?: string | null
          year?: string | null
        }
        Update: {
          capacity?: number
          course?: string
          created_at?: string | null
          id?: string
          name?: string
          room?: string | null
          semester?: string
          shift?: string | null
          year?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number
          id: string
          mode: string
          name: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          mode: string
          name: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          mode?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      disciplinas: {
        Row: {
          course: string | null
          date: string | null
          id: string
          name: string
          observations: string | null
          status: string | null
          teacher: string | null
          workload: number
        }
        Insert: {
          course?: string | null
          date?: string | null
          id?: string
          name: string
          observations?: string | null
          status?: string | null
          teacher?: string | null
          workload: number
        }
        Update: {
          course?: string | null
          date?: string | null
          id?: string
          name?: string
          observations?: string | null
          status?: string | null
          teacher?: string | null
          workload?: number
        }
        Relationships: []
      }
      financial_accounts: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          date: string
          description: string
          id: string
          status: string
          type: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          date: string
          description: string
          id?: string
          status: string
          type: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'financial_transactions_account_id_fkey'
            columns: ['account_id']
            isOneToOne: false
            referencedRelation: 'financial_accounts'
            referencedColumns: ['id']
          },
        ]
      }
      partners: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string
          name: string
          order_index: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url: string
          name: string
          order_index?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string
          name?: string
          order_index?: number | null
        }
        Relationships: []
      }
      payment_plans: {
        Row: {
          created_at: string | null
          id: string
          installments: number
          name: string
          status: string | null
          target: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          installments: number
          name: string
          status?: string | null
          target: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          installments?: number
          name?: string
          status?: string | null
          target?: string
          value?: number
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          attachments: Json | null
          created_at: string | null
          due_date: string
          id: string
          installment_number: number | null
          status: string | null
          student_id: string | null
          student_name: string | null
          total_installments: number | null
        }
        Insert: {
          amount: number
          attachments?: Json | null
          created_at?: string | null
          due_date: string
          id?: string
          installment_number?: number | null
          status?: string | null
          student_id?: string | null
          student_name?: string | null
          total_installments?: number | null
        }
        Update: {
          amount?: number
          attachments?: Json | null
          created_at?: string | null
          due_date?: string
          id?: string
          installment_number?: number | null
          status?: string | null
          student_id?: string | null
          student_name?: string | null
          total_installments?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          course: string
          created_at: string | null
          days: string
          id: string
          room: string | null
          subject: string
          time: string
        }
        Insert: {
          course: string
          created_at?: string | null
          days: string
          id?: string
          room?: string | null
          subject: string
          time: string
        }
        Update: {
          course?: string
          created_at?: string | null
          days?: string
          id?: string
          room?: string | null
          subject?: string
          time?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          key: string
          label: string
          sort_order: number | null
          value: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          key: string
          label: string
          sort_order?: number | null
          value: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          key?: string
          label?: string
          sort_order?: number | null
          value?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          address_city: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          avatar: string | null
          birth_city: string | null
          birth_date: string | null
          course: string | null
          cpf: string | null
          created_at: string | null
          email: string | null
          enrollment_date: string | null
          father_name: string | null
          id: string
          marital_status: string | null
          mother_name: string | null
          name: string
          nationality: string | null
          phone: string | null
          previous_graduation: string | null
          registration_code: string | null
          rg: string | null
          rg_issuer: string | null
          status: string | null
        }
        Insert: {
          address_city?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          avatar?: string | null
          birth_city?: string | null
          birth_date?: string | null
          course?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          enrollment_date?: string | null
          father_name?: string | null
          id?: string
          marital_status?: string | null
          mother_name?: string | null
          name: string
          nationality?: string | null
          phone?: string | null
          previous_graduation?: string | null
          registration_code?: string | null
          rg?: string | null
          rg_issuer?: string | null
          status?: string | null
        }
        Update: {
          address_city?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          avatar?: string | null
          birth_city?: string | null
          birth_date?: string | null
          course?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          enrollment_date?: string | null
          father_name?: string | null
          id?: string
          marital_status?: string | null
          mother_name?: string | null
          name?: string
          nationality?: string | null
          phone?: string | null
          previous_graduation?: string | null
          registration_code?: string | null
          rg?: string | null
          rg_issuer?: string | null
          status?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          avatar_url: string | null
          cpf: string | null
          created_at: string | null
          email: string | null
          featured: boolean | null
          id: string
          name: string
          order_index: number | null
          phone: string | null
          qualifications: string | null
          rg: string | null
          role: string | null
          status: string | null
          subjects: string | null
          workload: number | null
        }
        Insert: {
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          featured?: boolean | null
          id?: string
          name: string
          order_index?: number | null
          phone?: string | null
          qualifications?: string | null
          rg?: string | null
          role?: string | null
          status?: string | null
          subjects?: string | null
          workload?: number | null
        }
        Update: {
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          featured?: boolean | null
          id?: string
          name?: string
          order_index?: number | null
          phone?: string | null
          qualifications?: string | null
          rg?: string | null
          role?: string | null
          status?: string | null
          subjects?: string | null
          workload?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
