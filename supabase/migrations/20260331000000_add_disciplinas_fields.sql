-- Adicionando campos adicionais solicitados para a tabela disciplinas
ALTER TABLE public.disciplinas 
ADD COLUMN IF NOT EXISTS teacher text,
ADD COLUMN IF NOT EXISTS course text,
ADD COLUMN IF NOT EXISTS observations text;
