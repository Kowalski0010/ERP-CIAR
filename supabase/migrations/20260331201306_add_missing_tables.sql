CREATE TABLE IF NOT EXISTS public.teachers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    cpf TEXT,
    rg TEXT,
    subjects TEXT,
    workload INTEGER DEFAULT 40,
    status TEXT DEFAULT 'Ativo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_all_teachers" ON public.teachers;
CREATE POLICY "authenticated_all_teachers" ON public.teachers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.schedules (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    course TEXT NOT NULL,
    subject TEXT NOT NULL,
    days TEXT NOT NULL,
    time TEXT NOT NULL,
    room TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_all_schedules" ON public.schedules;
CREATE POLICY "authenticated_all_schedules" ON public.schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.payment_plans (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    target TEXT NOT NULL,
    value NUMERIC NOT NULL,
    installments INTEGER NOT NULL,
    status TEXT DEFAULT 'Ativo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_all_payment_plans" ON public.payment_plans;
CREATE POLICY "authenticated_all_payment_plans" ON public.payment_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);
