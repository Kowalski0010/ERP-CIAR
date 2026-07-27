ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS degree TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS undergraduate_degree TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS postgraduate_degree TEXT;
