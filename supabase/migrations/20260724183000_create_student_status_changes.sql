CREATE TABLE IF NOT EXISTS public.student_status_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT,
  changed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.student_status_changes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_student_status_changes" ON public.student_status_changes;
CREATE POLICY "authenticated_select_student_status_changes" ON public.student_status_changes
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert_student_status_changes" ON public.student_status_changes;
CREATE POLICY "authenticated_insert_student_status_changes" ON public.student_status_changes
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_student_status_changes" ON public.student_status_changes;
CREATE POLICY "authenticated_update_student_status_changes" ON public.student_status_changes
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_student_status_changes" ON public.student_status_changes;
CREATE POLICY "authenticated_delete_student_status_changes" ON public.student_status_changes
  FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_student_status_changes_student_id ON public.student_status_changes(student_id);
CREATE INDEX IF NOT EXISTS idx_student_status_changes_changed_by ON public.student_status_changes(changed_by);
