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

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: acr_patients
//   id: text (not null, default: (gen_random_uuid())::text)
//   name: text (not null)
//   email: text (nullable)
//   phone: text (nullable)
//   birth_date: date (nullable)
//   background: text (nullable)
//   registration_date: timestamp with time zone (nullable, default: now())
//   attachments: jsonb (nullable, default: '[]'::jsonb)
// Table: classes
//   id: text (not null, default: (gen_random_uuid())::text)
//   name: text (not null)
//   course: text (not null)
//   semester: text (not null)
//   capacity: integer (not null, default: 40)
//   room: text (nullable)
//   year: text (nullable)
//   shift: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: courses
//   id: text (not null, default: (gen_random_uuid())::text)
//   name: text (not null)
//   mode: text (not null)
//   duration: integer (not null)
//   status: text (nullable, default: 'Ativo'::text)
//   description: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: disciplinas
//   id: text (not null, default: (gen_random_uuid())::text)
//   name: text (not null)
//   workload: integer (not null)
//   status: text (nullable, default: 'Ativo'::text)
//   date: timestamp with time zone (nullable, default: now())
//   teacher: text (nullable)
//   course: text (nullable)
//   observations: text (nullable)
// Table: payments
//   id: text (not null, default: (gen_random_uuid())::text)
//   student_id: text (nullable)
//   student_name: text (nullable)
//   amount: numeric (not null)
//   due_date: date (not null)
//   status: text (nullable, default: 'Pendente'::text)
//   installment_number: integer (nullable)
//   total_installments: integer (nullable)
//   attachments: jsonb (nullable, default: '[]'::jsonb)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: students
//   id: text (not null, default: (gen_random_uuid())::text)
//   name: text (not null)
//   email: text (nullable)
//   phone: text (nullable)
//   cpf: text (nullable)
//   rg: text (nullable)
//   course: text (nullable)
//   status: text (nullable, default: 'Ativo'::text)
//   enrollment_date: timestamp with time zone (nullable, default: now())
//   avatar: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   registration_code: text (nullable)
//   nationality: text (nullable)
//   birth_city: text (nullable)
//   birth_date: date (nullable)
//   rg_issuer: text (nullable)
//   marital_status: text (nullable)
//   mother_name: text (nullable)
//   father_name: text (nullable)
//   address_street: text (nullable)
//   address_number: text (nullable)
//   address_neighborhood: text (nullable)
//   address_city: text (nullable)
//   address_state: text (nullable)
//   address_zip: text (nullable)
//   previous_graduation: text (nullable)

// --- CONSTRAINTS ---
// Table: acr_patients
//   PRIMARY KEY acr_patients_pkey: PRIMARY KEY (id)
// Table: classes
//   PRIMARY KEY classes_pkey: PRIMARY KEY (id)
// Table: courses
//   PRIMARY KEY courses_pkey: PRIMARY KEY (id)
// Table: disciplinas
//   PRIMARY KEY disciplinas_pkey: PRIMARY KEY (id)
// Table: payments
//   PRIMARY KEY payments_pkey: PRIMARY KEY (id)
// Table: students
//   PRIMARY KEY students_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: acr_patients
//   Policy "authenticated_all_acr_patients" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: classes
//   Policy "authenticated_all_classes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: courses
//   Policy "authenticated_delete_courses" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_courses" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_courses" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_courses" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: disciplinas
//   Policy "authenticated_all_disciplinas" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: payments
//   Policy "authenticated_all_payments" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: students
//   Policy "authenticated_all_students" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- DATABASE FUNCTIONS ---
// FUNCTION force_generate_id()
//   CREATE OR REPLACE FUNCTION public.force_generate_id()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     IF NEW.id IS NULL THEN
//       NEW.id := gen_random_uuid()::text;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: payments
//   ensure_payment_id: CREATE TRIGGER ensure_payment_id BEFORE INSERT ON public.payments FOR EACH ROW EXECUTE FUNCTION force_generate_id()
// Table: students
//   ensure_student_id: CREATE TRIGGER ensure_student_id BEFORE INSERT ON public.students FOR EACH ROW EXECUTE FUNCTION force_generate_id()
