-- Sirius Academy — Schema Supabase
-- Execute este SQL no Supabase SQL Editor

-- ============================================================================
-- COMPRAS (Desbloqueio de Genialidade e Cursos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS academy_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  produto_tipo TEXT NOT NULL CHECK (produto_tipo IN ('genialidade', 'curso')),
  curso_id TEXT,                          -- null para genialidade
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'falhou')),
  valor NUMERIC NOT NULL,
  metodo_pagamento TEXT NOT NULL,         -- card | pix | boleto
  asaas_payment_id TEXT,
  asaas_customer_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE academy_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own purchases" ON academy_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Admin pode ver tudo (via service role — sem RLS)
CREATE INDEX IF NOT EXISTS idx_purchases_user ON academy_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_asaas ON academy_purchases(asaas_payment_id);

-- ============================================================================
-- LEADS DO CHECKOUT (quem chegou na etapa de pagamento)
-- ============================================================================
CREATE TABLE IF NOT EXISTS academy_checkout_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  produto_tipo TEXT NOT NULL,  -- 'genialidade' | 'curso'
  curso_id TEXT,               -- null para genialidade
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE academy_checkout_leads ENABLE ROW LEVEL SECURITY;

-- Só o admin (via service role) pode ver — anon não acessa
-- Inserção via API server-side (service role), sem policy de INSERT para anon

-- ============================================================================
-- PROFILES (Perfis dos jogadores)
-- ============================================================================
CREATE TABLE IF NOT EXISTS academy_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  avatar_id TEXT DEFAULT 'wolf',
  xp INTEGER DEFAULT 0 NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  title TEXT DEFAULT 'Iniciante' NOT NULL,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Se a tabela já existe, adicionar coluna email:
-- ALTER TABLE academy_profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- ============================================================================
-- PROGRESSO DOS MÓDULOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS academy_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase_id INTEGER NOT NULL,
  module_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE academy_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: usuário vê só o próprio perfil
CREATE POLICY "Users can view own profile" ON academy_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON academy_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON academy_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Progress: usuário vê só o próprio progresso
CREATE POLICY "Users can view own progress" ON academy_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON academy_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON academy_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- FUNÇÃO: Atualizar XP e Level automaticamente
-- ============================================================================
CREATE OR REPLACE FUNCTION update_user_xp(
  p_user_id UUID,
  p_xp_to_add INTEGER
)
RETURNS void AS $$
DECLARE
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_new_title TEXT;
BEGIN
  UPDATE academy_profiles
  SET xp = xp + p_xp_to_add,
      updated_at = NOW()
  WHERE id = p_user_id
  RETURNING xp INTO v_new_xp;

  -- Calcular level baseado no XP
  IF v_new_xp >= 2100 THEN
    v_new_level := 5; v_new_title := 'Mestre da IA';
  ELSIF v_new_xp >= 1300 THEN
    v_new_level := 4; v_new_title := 'Especialista';
  ELSIF v_new_xp >= 700 THEN
    v_new_level := 3; v_new_title := 'Praticante';
  ELSIF v_new_xp >= 300 THEN
    v_new_level := 2; v_new_title := 'Aprendiz';
  ELSE
    v_new_level := 1; v_new_title := 'Iniciante';
  END IF;

  UPDATE academy_profiles
  SET level = v_new_level, title = v_new_title
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GENIUS ZONE — RESPOSTAS DO QUIZ
-- ============================================================================
CREATE TABLE IF NOT EXISTS genius_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE genius_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own assessment" ON genius_assessments
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- GENIUS ZONE — BLUEPRINTS GERADOS PELA IA
-- ============================================================================
CREATE TABLE IF NOT EXISTS genius_blueprints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blueprint_md TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE genius_blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own blueprint" ON genius_blueprints
  FOR ALL USING (auth.uid() = user_id);
