-- Migração para estruturar o Banco de Dados para os Módulos Pedagógico, Financeiro e ACR
-- Garantindo persistência total e evitando perda de dados temporários.

-- Tabela: Disciplinas (Pedagógico)
CREATE TABLE IF NOT EXISTS public.disciplinas (
    id text PRIMARY KEY DEFAULT (gen_random_uuid())::text,
    name text NOT NULL,
    workload integer NOT NULL,
    status text DEFAULT 'Ativo',
    date timestamptz DEFAULT now()
);

ALTER TABLE public.disciplinas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_all_disciplinas" ON public.disciplinas;
CREATE POLICY "authenticated_all_disciplinas" ON public.disciplinas 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tabela: Classes / Turmas (Pedagógico)
CREATE TABLE IF NOT EXISTS public.classes (
    id text PRIMARY KEY DEFAULT (gen_random_uuid())::text,
    name text NOT NULL,
    course text NOT NULL,
    semester text NOT NULL,
    capacity integer NOT NULL DEFAULT 40,
    room text,
    year text,
    shift text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_all_classes" ON public.classes;
CREATE POLICY "authenticated_all_classes" ON public.classes 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tabela: ACR Pacientes (Clínica)
CREATE TABLE IF NOT EXISTS public.acr_patients (
    id text PRIMARY KEY DEFAULT (gen_random_uuid())::text,
    name text NOT NULL,
    email text,
    phone text,
    birth_date date,
    background text,
    registration_date timestamptz DEFAULT now(),
    attachments jsonb DEFAULT '[]'::jsonb
);

ALTER TABLE public.acr_patients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_all_acr_patients" ON public.acr_patients;
CREATE POLICY "authenticated_all_acr_patients" ON public.acr_patients 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tabela: Pagamentos (Financeiro)
CREATE TABLE IF NOT EXISTS public.payments (
    id text PRIMARY KEY DEFAULT (gen_random_uuid())::text,
    student_id text,
    student_name text,
    amount numeric(10,2) NOT NULL,
    due_date date NOT NULL,
    status text DEFAULT 'Pendente',
    installment_number integer,
    total_installments integer,
    attachments jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_all_payments" ON public.payments;
CREATE POLICY "authenticated_all_payments" ON public.payments 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed Inicial (Opcional, apenas para garantir visualização imediata nos testes)
DO $$ 
BEGIN
    INSERT INTO public.classes (id, name, course, semester, capacity, room, year, shift)
    VALUES
        ('T01', 'Engenharia de Software 1', 'Engenharia de Software', '1º Semestre', 40, 'Sala 101', '2024', 'Noturno'),
        ('T02', 'Design Gráfico Avançado', 'Design Gráfico', '3º Semestre', 30, 'Laboratório 2', '2024', 'Matutino')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.disciplinas (id, name, workload, status)
    VALUES
        ('D01', 'Lógica de Programação', 80, 'Ativo'),
        ('D02', 'Design de Interfaces', 60, 'Ativo')
    ON CONFLICT (id) DO NOTHING;
END $$;
