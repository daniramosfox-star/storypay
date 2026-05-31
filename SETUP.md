# Storypay — Setup completo

---

## 1. Criar projeto no Supabase

1. Acesse https://supabase.com e clique em **New project**
2. Escolha nome: `storypay`
3. Defina uma senha forte para o banco
4. Região: `South America (São Paulo)` — sa-east-1
5. Aguarde o projeto ser criado (~1 min)

## 2. Executar o schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Cole o conteúdo de `supabase/schema.sql`
4. Clique em **Run**

## 3. Configurar variáveis de ambiente

1. No Supabase, vá em **Settings → API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Abra `.env.local` e substitua os valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Configurar autenticação

1. No Supabase, vá em **Authentication → Providers**
2. Email: marque **Enable Email Signup** ✓
3. Em **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`
4. (Opcional) Desative **Confirm email** para desenvolvimento:
   - Authentication → Settings → desmarque "Enable email confirmations"

## 5. Iniciar o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 6. Criar primeiro admin

Após criar um usuário via cadastro, execute no SQL Editor:

```sql
UPDATE profiles SET tipo = 'admin' WHERE id = 'seu-user-id-aqui';
```

---

## Pagar.me

### 7. Criar conta no Pagar.me

1. Acesse [pagar.me](https://pagar.me) e crie uma conta
2. Vá em **Configurações → Chaves de API**
3. Copie as chaves de **teste** (prefixo `sk_test_` / `pk_test_`)
4. Cole no `.env.local`:

```env
PAGARME_SECRET_KEY=sk_test_xxxxxxxxxxxx
PAGARME_PUBLIC_KEY=pk_test_xxxxxxxxxxxx
```

### 8. Configurar webhook

1. No Pagar.me, vá em **Configurações → Webhooks**
2. Adicione a URL: `https://seudominio.com.br/api/pagamentos/webhook`
3. Eventos a assinar:
   - `order.paid` — PIX confirmado (credita saldo da marca)
   - `transfer.paid` — Transferência ao influencer confirmada
4. Copie o **Webhook Secret** e cole no `.env.local`:
```env
PAGARME_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

> Em desenvolvimento, use [ngrok](https://ngrok.com) para expor o localhost:
> ```bash
> ngrok http 3000
> # Use a URL gerada como webhook URL no Pagar.me
> ```

### Fluxo de pagamentos

```
Marca deposita R$ 1.000 via PIX
  └─ Pagar.me confirma → webhook order.paid
       └─ Saldo da marca + R$ 1.000

Influencer aceita campanha (valor: R$ 200)
  └─ Marca confirma entrega (ou expira 48h)
       └─ API /liberar
            ├─ Marca: - R$ 200
            ├─ Influencer: + R$ 170 (85%)
            └─ Plataforma: + R$ 30 (15%)

Influencer solicita saque de R$ 170
  └─ API /saque → Pagar.me transferência PIX
       └─ Influencer recebe em até 1 dia útil
```

---

## Estrutura das tabelas

| Tabela | Descrição |
|---|---|
| `profiles` | Estende auth.users com dados de influencer ou marca |
| `campanhas` | Campanhas criadas pelas marcas |
| `entregas` | Uma entrega por influencer por campanha |
| `disputas` | Conflitos entre marca e influencer |
| `transacoes` | Histórico financeiro |
| `notificacoes` | Notificações in-app |
