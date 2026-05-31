-- ================================================================
-- STORYPAY — Schema completo do banco de dados
-- Execute no SQL Editor do Supabase
-- ================================================================

-- ----------------------------------------------------------------
-- PROFILES — estende auth.users com dados de influencer ou marca
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('influencer', 'marca', 'admin')),
  nome TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Influencer fields
  instagram TEXT,
  tiktok TEXT,
  nicho TEXT CHECK (nicho IN ('Fitness','Moda','Beleza','Games','Gastronomia','Finanças','Pets','Viagem') OR nicho IS NULL),
  seguidores INTEGER DEFAULT 0,
  bio TEXT,
  taxa_base NUMERIC(10,2) DEFAULT 0,
  rating NUMERIC(3,1) DEFAULT 0,
  posts_entregues INTEGER DEFAULT 0,
  advertencias INTEGER DEFAULT 0,
  plano TEXT DEFAULT 'free' CHECK (plano IN ('free', 'pro')),
  saldo NUMERIC(10,2) DEFAULT 0,

  -- Marca fields
  empresa TEXT,
  cnpj TEXT,
  site TEXT
);

-- ----------------------------------------------------------------
-- CAMPANHAS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campanhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marca_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  nicho TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'Instagram',
  post_type TEXT NOT NULL CHECK (post_type IN ('story', 'feed')),
  feed_duration TEXT DEFAULT '24h',
  valor_base NUMERIC(10,2) NOT NULL,
  legenda TEXT,
  hashtags TEXT,
  mentions TEXT,
  link_destino TEXT,
  material_url TEXT,
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'pausada', 'encerrada')),
  budget_total NUMERIC(10,2) NOT NULL,
  budget_gasto NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- ENTREGAS — uma por influencer aceito por campanha
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS entregas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  valor NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'aceita'
    CHECK (status IN ('aceita','entregue','confirmada','paga','disputa','cancelada')),
  link_post TEXT,
  entregue_em TIMESTAMPTZ,
  confirmado_em TIMESTAMPTZ,
  prazo_confirmacao TIMESTAMPTZ, -- marca tem até aqui pra confirmar
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campanha_id, influencer_id)
);

-- ----------------------------------------------------------------
-- DISPUTAS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS disputas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entrega_id UUID NOT NULL REFERENCES entregas(id) ON DELETE CASCADE,
  aberta_por TEXT NOT NULL CHECK (aberta_por IN ('marca', 'influencer')),
  alegacao_marca TEXT,
  alegacao_influencer TEXT,
  evidencia_url TEXT,
  status TEXT NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta','resolvida')),
  veredito TEXT CHECK (veredito IN ('marca', 'influencer')),
  nota_admin TEXT,
  resolvida_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TRANSAÇÕES financeiras
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('deposito','pagamento','taxa','saque','estorno')),
  valor NUMERIC(10,2) NOT NULL,
  descricao TEXT,
  referencia_id UUID, -- entrega_id ou campanha_id
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- NOTIFICAÇÕES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputas ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- Profiles: usuário vê/edita apenas o próprio, admins veem tudo
CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true); -- influencers visíveis pra todos

-- Campanhas: marca gerencia as suas, influencers leem todas ativas
CREATE POLICY "campanhas_marca_manage" ON campanhas
  FOR ALL USING (auth.uid() = marca_id);

CREATE POLICY "campanhas_influencer_read" ON campanhas
  FOR SELECT USING (status = 'ativa');

-- Entregas: influencer gerencia as suas, marca vê as da campanha
CREATE POLICY "entregas_influencer" ON entregas
  FOR ALL USING (auth.uid() = influencer_id);

CREATE POLICY "entregas_marca_read" ON entregas
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM campanhas WHERE id = entrega_id AND marca_id = auth.uid())
  );

CREATE POLICY "entregas_marca_confirm" ON entregas
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM campanhas WHERE id = campanha_id AND marca_id = auth.uid())
  );

-- Disputas: partes envolvidas veem
CREATE POLICY "disputas_envolvidos" ON disputas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM entregas e
      JOIN campanhas c ON c.id = e.campanha_id
      WHERE e.id = entrega_id
        AND (e.influencer_id = auth.uid() OR c.marca_id = auth.uid())
    )
  );

-- Transações: próprio usuário
CREATE POLICY "transacoes_own" ON transacoes
  FOR ALL USING (auth.uid() = user_id);

-- Notificações: próprio usuário
CREATE POLICY "notificacoes_own" ON notificacoes
  FOR ALL USING (auth.uid() = user_id);

-- ================================================================
-- FUNÇÕES E TRIGGERS
-- ================================================================

-- Auto-cria perfil básico quando usuário se registra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, tipo, nome)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'tipo', 'influencer'),
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Libera pagamento automaticamente após 48h sem confirmação
CREATE OR REPLACE FUNCTION auto_confirm_deliveries()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE entregas
  SET status = 'paga', confirmado_em = NOW()
  WHERE status = 'entregue'
    AND prazo_confirmacao < NOW();
END;
$$;

-- Atualiza updated_at nas campanhas
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER campanhas_updated_at
  BEFORE UPDATE ON campanhas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Incrementa contador de posts entregues do influencer
CREATE OR REPLACE FUNCTION increment_posts_entregues(uid UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE profiles SET posts_entregues = posts_entregues + 1 WHERE id = uid;
END;
$$;

-- ================================================================
-- VIEWS úteis
-- ================================================================

-- Campanhas com stats de entrega
CREATE OR REPLACE VIEW campanhas_com_stats AS
SELECT
  c.*,
  p.nome AS marca_nome,
  COUNT(e.id) AS total_entregas,
  COUNT(e.id) FILTER (WHERE e.status = 'aceita') AS entregas_aceitas,
  COUNT(e.id) FILTER (WHERE e.status = 'entregue') AS entregas_aguardando,
  COUNT(e.id) FILTER (WHERE e.status = 'paga') AS entregas_pagas,
  COALESCE(SUM(e.valor) FILTER (WHERE e.status = 'paga'), 0) AS total_pago
FROM campanhas c
JOIN profiles p ON p.id = c.marca_id
LEFT JOIN entregas e ON e.campanha_id = c.id
GROUP BY c.id, p.nome;

-- Ranking de influencers
CREATE OR REPLACE VIEW ranking_influencers AS
SELECT
  p.*,
  COALESCE(SUM(t.valor) FILTER (WHERE t.tipo = 'pagamento' AND t.valor > 0), 0) AS total_ganho
FROM profiles p
LEFT JOIN transacoes t ON t.user_id = p.id
WHERE p.tipo = 'influencer'
GROUP BY p.id
ORDER BY total_ganho DESC;
