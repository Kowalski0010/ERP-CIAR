DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'contract') THEN
    ALTER TABLE public.students ADD COLUMN contract TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'observations') THEN
    ALTER TABLE public.students ADD COLUMN observations TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'due_day') THEN
    ALTER TABLE public.students ADD COLUMN due_day TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'documents') THEN
    ALTER TABLE public.students ADD COLUMN documents JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public) VALUES ('student-documents', 'student-documents', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "authenticated_upload_student_docs" ON storage.objects;
CREATE POLICY "authenticated_upload_student_docs" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'student-documents');

DROP POLICY IF EXISTS "authenticated_read_student_docs" ON storage.objects;
CREATE POLICY "authenticated_read_student_docs" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'student-documents');

DROP POLICY IF EXISTS "authenticated_delete_student_docs" ON storage.objects;
CREATE POLICY "authenticated_delete_student_docs" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'student-documents');
