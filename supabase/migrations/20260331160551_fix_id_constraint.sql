-- Set defaults for IDs to ensure they auto-generate if omitted
DO $$ 
BEGIN
  ALTER TABLE public.students ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
  ALTER TABLE public.payments ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
  ALTER TABLE public.classes ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
  ALTER TABLE public.courses ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
  ALTER TABLE public.disciplinas ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
EXCEPTION WHEN OTHERS THEN 
  NULL;
END $$;

-- Create a robust trigger function to enforce ID generation if NULL is passed by the client
CREATE OR REPLACE FUNCTION public.force_generate_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := gen_random_uuid()::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to students
DROP TRIGGER IF EXISTS ensure_student_id ON public.students;
CREATE TRIGGER ensure_student_id
  BEFORE INSERT ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.force_generate_id();

-- Apply trigger to payments
DROP TRIGGER IF EXISTS ensure_payment_id ON public.payments;
CREATE TRIGGER ensure_payment_id
  BEFORE INSERT ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.force_generate_id();

-- Fix RLS Policies for students to prevent "unauthorized" errors
DROP POLICY IF EXISTS "authenticated_insert_students" ON public.students;
DROP POLICY IF EXISTS "authenticated_update_students" ON public.students;
DROP POLICY IF EXISTS "authenticated_select_students" ON public.students;
DROP POLICY IF EXISTS "authenticated_delete_students" ON public.students;
DROP POLICY IF EXISTS "authenticated_all_students" ON public.students;

CREATE POLICY "authenticated_all_students" ON public.students 
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Fix RLS Policies for payments
DROP POLICY IF EXISTS "authenticated_insert_payments" ON public.payments;
DROP POLICY IF EXISTS "authenticated_update_payments" ON public.payments;
DROP POLICY IF EXISTS "authenticated_select_payments" ON public.payments;
DROP POLICY IF EXISTS "authenticated_delete_payments" ON public.payments;
DROP POLICY IF EXISTS "authenticated_all_payments" ON public.payments;

CREATE POLICY "authenticated_all_payments" ON public.payments 
FOR ALL TO authenticated USING (true) WITH CHECK (true);
