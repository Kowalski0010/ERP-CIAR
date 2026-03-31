DO $$
BEGIN
  ALTER TABLE public.students ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
  ALTER TABLE public.disciplinas ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
  ALTER TABLE public.classes ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
  ALTER TABLE public.courses ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
  ALTER TABLE public.payments ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
  ALTER TABLE public.acr_patients ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
END $$;
