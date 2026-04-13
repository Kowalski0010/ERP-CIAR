-- Create financial accounts table
CREATE TABLE IF NOT EXISTS public.financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Receita', 'Despesa')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create financial transactions table
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.financial_accounts(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Receita', 'Despesa')),
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Realizado', 'Previsto')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "authenticated_all_financial_accounts" ON public.financial_accounts;
CREATE POLICY "authenticated_all_financial_accounts" ON public.financial_accounts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_all_financial_transactions" ON public.financial_transactions;
CREATE POLICY "authenticated_all_financial_transactions" ON public.financial_transactions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed default accounts
INSERT INTO public.financial_accounts (name, type, description) VALUES
  ('Mensalidades', 'Receita', 'Recebimento de mensalidades de alunos'),
  ('Taxas de Matrícula', 'Receita', 'Taxas cobradas na matrícula'),
  ('Salários', 'Despesa', 'Pagamento de funcionários e professores'),
  ('Aluguel', 'Despesa', 'Aluguel do espaço físico'),
  ('Energia Elétrica', 'Despesa', 'Conta de luz'),
  ('Internet e Telefonia', 'Despesa', 'Serviços de telecomunicação'),
  ('Materiais de Escritório', 'Despesa', 'Materiais de uso geral')
ON CONFLICT DO NOTHING;
