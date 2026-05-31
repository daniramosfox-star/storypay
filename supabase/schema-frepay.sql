-- ================================================================
-- FREPAY — Schema completo do banco de dados
-- Marketplace de prestadores de serviço com geolocalização
-- Execute no SQL Editor do Supabase (substitui o schema Storypay)
-- ================================================================

-- Habilita extensão de geolocalização
CREATE EXTENSION IF NOT EXISTS postgis;

-- ----------------------------------------------------------------
-- CATEGORIAS de serviço
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id TEXT PRIMARY KEY, -- slug: 'ar-condicionado'
  nome TEXT NOT NULL,
  emoji TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  ordem INTEGER DEFAULT 0
);

INSERT INTO categorias VALUES
  ('ar-condicionado', 'Ar condicionado', '❄️', 'Instalação, manutenção e reparo de ar condicionado', true, 1),
  ('eletrica', 'Elétrica', '⚡', 'Eletricista residencial e comercial', true, 2),
  ('encanamento', 'Encanamento', '🔧', 'Encanador e hidráulica', true, 3),
  ('pintura', 'Pintura', '🖌️', 'Pintura residencial e comercial', true, 4),
  ('marido-de-aluguel', 'Marido de aluguel', '🔨', 'Pequenos reparos e serviços gerais', true, 5),
  ('limpeza', 'Limpeza', '🧹', 'Limpeza residencial e comercial', true, 6),
  ('informatica', 'Informática', '💻', 'Suporte técnico e manutenção de computadores', true, 7),
  ('serralheria', 'Serralheria', '🔩', 'Grades, portões e estruturas metálicas', true, 8),
  ('jardinagem', 'Jardinagem', '🌿', 'Corte de grama, poda e paisagismo', true, 9),
  ('mudanca', 'Mudança', '📦', 'Transporte e mudanças residenciais', true, 10)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- CIDADES e BAIRROS — para SEO programático
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cidades (
  id TEXT PRIMARY KEY, -- slug: 'goiania'
  nome TEXT NOT NULL,
  estado TEXT NOT NULL, -- 'GO'
  estado_nome TEXT NOT NULL, -- 'Goiás'
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bairros (
  id TEXT PRIMARY KEY, -- slug: 'setor-bueno'
  nome TEXT NOT NULL,
  cidade_id TEXT NOT NULL REFERENCES cidades(id),
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6)
);

-- Cidades iniciais
INSERT INTO cidades VALUES
  ('goiania', 'Goiânia', 'GO', 'Goiás', -16.6864, -49.2643, true),
  ('aparecida-de-goiania', 'Aparecida de Goiânia', 'GO', 'Goiás', -16.8232, -49.2441, true),
  ('brasilia', 'Brasília', 'DF', 'Distrito Federal', -15.7801, -47.9292, true),
  ('sao-paulo', 'São Paulo', 'SP', 'São Paulo', -23.5505, -46.6333, true),
  ('rio-de-janeiro', 'Rio de Janeiro', 'RJ', 'Rio de Janeiro', -22.9068, -43.1729, true),
  ('belo-horizonte', 'Belo Horizonte', 'MG', 'Minas Gerais', -19.9167, -43.9345, true)
ON CONFLICT (id) DO NOTHING;

-- Bairros de Goiânia
INSERT INTO bairros VALUES
  ('setor-bueno', 'Setor Bueno', 'goiania', -16.7071, -49.2611),
  ('setor-marista', 'Setor Marista', 'goiania', -16.7152, -49.2582),
  ('jardim-goias', 'Jardim Goiás', 'goiania', -16.7078, -49.2384),
  ('setor-oeste', 'Setor Oeste', 'goiania', -16.6863, -49.2737),
  ('setor-sul', 'Setor Sul', 'goiania', -16.7175, -49.2665),
  ('setor-aeroporto', 'Setor Aeroporto', 'goiania', -16.6397, -49.2257),
  ('vila-nova', 'Vila Nova', 'goiania', -16.7043, -49.2820),
  ('campinas', 'Campinas', 'goiania', -16.6920, -49.2345)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- PROFILES — prestadores e clientes
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('prestador', 'cliente', 'admin')),
  nome TEXT NOT NULL,
  telefone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Campos de prestador
  categoria_id TEXT REFERENCES categorias(id),
  categorias_extras TEXT[], -- categorias adicionais
  bio TEXT,
  cidade_id TEXT REFERENCES cidades(id),
  bairros_atendidos TEXT[], -- slugs dos bairros
  anos_experiencia INTEGER,
  rating NUMERIC(3,1) DEFAULT 0,
  total_avaliacoes INTEGER DEFAULT 0,
  total_servicos INTEGER DEFAULT 0,
  verificado BOOLEAN DEFAULT FALSE,

  -- Geolocalização
  is_online BOOLEAN DEFAULT FALSE,
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  last_seen TIMESTAMPTZ,

  -- Monetização
  leads_gratis_hoje INTEGER DEFAULT 0, -- reinicia a meia-noite
  leads_gratis_data DATE, -- data em que foi zerado
  saldo NUMERIC(10,2) DEFAULT 0,

  -- Plano
  plano TEXT DEFAULT 'free' CHECK (plano IN ('free', 'pro'))
);

-- ----------------------------------------------------------------
-- PEDIDOS de serviço (feitos pelos clientes)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id TEXT NOT NULL REFERENCES categorias(id),
  descricao TEXT NOT NULL,

  -- Localização do cliente
  endereco TEXT NOT NULL,
  cidade_id TEXT REFERENCES cidades(id),
  bairro_id TEXT REFERENCES bairros(id),
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),

  -- Contato do cliente (visível só após pagamento do lead)
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT NOT NULL, -- mostrado só após compra do lead
  cliente_email TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_atendimento', 'encerrado')),
  urgencia TEXT DEFAULT 'normal' CHECK (urgencia IN ('normal', 'urgente')),

  -- Rastreio
  ip_origem TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '48 hours'
);

-- ----------------------------------------------------------------
-- LEADS — prestador compra acesso ao contato do cliente
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  prestador_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Pagamento
  valor NUMERIC(10,2) NOT NULL DEFAULT 1.99,
  gratis BOOLEAN DEFAULT FALSE, -- TRUE se for a 1ª indicação do dia
  pago BOOLEAN DEFAULT FALSE,
  payment_id TEXT, -- ID do pagamento no Mercado Pago

  -- Estado
  contato_revelado BOOLEAN DEFAULT FALSE, -- telefone visível
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(pedido_id, prestador_id)
);

-- ----------------------------------------------------------------
-- AVALIAÇÕES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pedido_id UUID REFERENCES pedidos(id),
  nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TRANSAÇÕES financeiras (saldo dos prestadores)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('compra_lead', 'saldo_adicionado', 'estorno')),
  valor NUMERIC(10,2) NOT NULL,
  descricao TEXT,
  lead_id UUID REFERENCES leads(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;

-- Profiles: leitura pública de prestadores, edição só do dono
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_write" ON profiles FOR ALL USING (auth.uid() = id);

-- Pedidos: qualquer um pode criar, prestadores veem os abertos
CREATE POLICY "pedidos_public_create" ON pedidos FOR INSERT WITH CHECK (true);
CREATE POLICY "pedidos_read_open" ON pedidos FOR SELECT USING (
  status = 'aberto' OR cliente_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Leads: prestador vê os seus
CREATE POLICY "leads_own" ON leads FOR ALL USING (auth.uid() = prestador_id);

-- Avaliações: leitura pública
CREATE POLICY "avaliacoes_public_read" ON avaliacoes FOR SELECT USING (true);
CREATE POLICY "avaliacoes_create" ON avaliacoes FOR INSERT WITH CHECK (true);

-- Transações: só o próprio prestador
CREATE POLICY "transacoes_own" ON transacoes FOR ALL USING (auth.uid() = prestador_id);

-- ----------------------------------------------------------------
-- FUNÇÕES
-- ----------------------------------------------------------------

-- Auto-cria profile ao registrar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, tipo, nome)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'tipo', 'cliente'),
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Reinicia leads grátis diários
CREATE OR REPLACE FUNCTION reset_leads_diarios(uid UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE profiles
  SET leads_gratis_hoje = 0, leads_gratis_data = CURRENT_DATE
  WHERE id = uid AND (leads_gratis_data IS NULL OR leads_gratis_data < CURRENT_DATE);
END;
$$;

-- Conta leads do dia para um prestador
CREATE OR REPLACE FUNCTION leads_hoje(uid UUID)
RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE cnt INTEGER;
BEGIN
  SELECT COUNT(*) INTO cnt FROM leads
  WHERE prestador_id = uid AND created_at::date = CURRENT_DATE AND pago = true;
  RETURN cnt;
END;
$$;

-- Atualiza rating do prestador após avaliação
CREATE OR REPLACE FUNCTION update_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE profiles SET
    rating = (SELECT AVG(nota) FROM avaliacoes WHERE prestador_id = NEW.prestador_id),
    total_avaliacoes = (SELECT COUNT(*) FROM avaliacoes WHERE prestador_id = NEW.prestador_id)
  WHERE id = NEW.prestador_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER after_avaliacao
  AFTER INSERT ON avaliacoes
  FOR EACH ROW EXECUTE FUNCTION update_rating();

-- ----------------------------------------------------------------
-- VIEWS úteis
-- ----------------------------------------------------------------

-- Prestadores online com distância (requer PostGIS)
CREATE OR REPLACE VIEW prestadores_online AS
SELECT
  p.*,
  c.nome AS categoria_nome,
  c.emoji AS categoria_emoji,
  ci.nome AS cidade_nome
FROM profiles p
LEFT JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN cidades ci ON ci.id = p.cidade_id
WHERE p.tipo = 'prestador' AND p.is_online = TRUE;

-- Pedidos abertos com categoria
CREATE OR REPLACE VIEW pedidos_abertos AS
SELECT
  p.*,
  c.nome AS categoria_nome,
  c.emoji AS categoria_emoji,
  ci.nome AS cidade_nome,
  b.nome AS bairro_nome
FROM pedidos p
JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN cidades ci ON ci.id = p.cidade_id
LEFT JOIN bairros b ON b.id = p.bairro_id
WHERE p.status = 'aberto' AND p.expires_at > NOW()
ORDER BY p.created_at DESC;

-- Leads do dia por prestador
CREATE OR REPLACE VIEW leads_stats AS
SELECT
  prestador_id,
  COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) AS leads_hoje,
  COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE AND gratis = true) AS gratis_hoje,
  COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE AND pago = true AND gratis = false) AS pagos_hoje,
  SUM(valor) FILTER (WHERE created_at::date = CURRENT_DATE AND pago = true AND gratis = false) AS gasto_hoje
FROM leads
GROUP BY prestador_id;
