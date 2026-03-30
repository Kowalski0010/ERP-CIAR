DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kowalski0010@gmail.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'kowalski0010@gmail.com',
      crypt('securepassword123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cpf TEXT,
  rg TEXT,
  course TEXT,
  status TEXT DEFAULT 'Ativo',
  enrollment_date TIMESTAMPTZ DEFAULT NOW(),
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_students" ON public.students;
CREATE POLICY "authenticated_select_students" ON public.students FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert_students" ON public.students;
CREATE POLICY "authenticated_insert_students" ON public.students FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_students" ON public.students;
CREATE POLICY "authenticated_update_students" ON public.students FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_students" ON public.students;
CREATE POLICY "authenticated_delete_students" ON public.students FOR DELETE TO authenticated USING (true);


CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  mode TEXT NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT DEFAULT 'Ativo',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_courses" ON public.courses;
CREATE POLICY "authenticated_select_courses" ON public.courses FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert_courses" ON public.courses;
CREATE POLICY "authenticated_insert_courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_courses" ON public.courses;
CREATE POLICY "authenticated_update_courses" ON public.courses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_courses" ON public.courses;
CREATE POLICY "authenticated_delete_courses" ON public.courses FOR DELETE TO authenticated USING (true);
