# 🏗️ Arquitetura e Estrutura do PastoSmart

## 📊 Visão Geral da Aplicação

```
┌─────────────────────────────────────────────────────────────────┐
│                      PASTOSMART v0.1.0                          │
│                   Sistema de Gestão de Gado                      │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │  Navegador   │
                    │  (Cliente)   │
                    └───────┬──────┘
                            │
                    ┌───────▼────────┐
                    │  Next.js 15.5  │
                    │   App Router   │
                    │  + TypeScript  │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼────┐      ┌──────▼──────┐      ┌─────▼────┐
    │ Pages  │      │ Components  │      │   API    │
    │ React  │      │   React     │      │ Routes   │
    └────────┘      └─────────────┘      └──────────┘
                            │                   │
                            └───────┬───────────┘
                                    │
                            ┌───────▼────────┐
                            │  Prisma ORM    │
                            │  + Validation  │
                            └───────┬────────┘
                                    │
                            ┌───────▼────────┐
                            │     MySQL      │
                            │   Database     │
                            └────────────────┘
```

---

## 🗂️ Estrutura de Pastas

```
PastoSmart/
├── src/
│   ├── app/
│   │   ├── adm/                          # Área Administrativa
│   │   │   ├── page.tsx                  # Dashboard Principal
│   │   │   ├── vendas/
│   │   │   │   ├── page.tsx              # Página de Vendas
│   │   │   │   └── analise/
│   │   │   │       ├── page.tsx          # Análise com Gráficos ⭐
│   │   │   │       └── components/
│   │   │   │           ├── GraficoVendas.tsx
│   │   │   │           └── TabelaVendas.tsx
│   │   │   ├── lote/
│   │   │   │   ├── page.tsx              # Gerenciar Lotes
│   │   │   │   ├── novo-lote/
│   │   │   │   └── [id]/
│   │   │   ├── relatorios/
│   │   │   │   ├── page.tsx              # Gerador de Relatórios ⭐
│   │   │   │   └── components/
│   │   │   │       └── RelatorioTable.tsx
│   │   │   └── components/
│   │   │       └── Sidebar.tsx           # Menu Lateral
│   │   │
│   │   ├── peao/                         # Área do Peão
│   │   │   ├── page.tsx
│   │   │   ├── lote/
│   │   │   └── novo-lote/
│   │   │
│   │   ├── api/
│   │   │   ├── lotes/
│   │   │   │   ├── route.ts              # CRUD de Lotes
│   │   │   │   └── [id]/
│   │   │   ├── bois/
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── pesagem/
│   │   │   ├── relatorios/
│   │   │   │   └── route.ts              # API de Relatórios ⭐
│   │   │   ├── vendas/
│   │   │   │   └── analise/
│   │   │   │       └── route.ts          # API de Análise ⭐
│   │   │   ├── cadastro/
│   │   │   ├── logout/
│   │   │   └── debug/
│   │   │
│   │   ├── layout.tsx                    # Layout Global
│   │   ├── page.tsx                      # Home / Login
│   │   └── globals.css
│   │
│   ├── lib/
│   │   ├── auth.ts                       # Utilitários de Autenticação
│   │   └── jwt.ts
│   │
│   ├── middleware.ts                     # Proteção de Rotas
│   └── types/
│       └── index.ts
│
├── prisma/
│   ├── schema.prisma                     # Modelos do BD
│   └── migrations/
│
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.js
```

---

## 🔄 Fluxo de Dados

### 1. Dashboard (Home Admin)

```
User acessa /adm
    ↓
Middleware verifica JWT token
    ↓
AdminHomePage.tsx renderiza (Server Component)
    ↓
fetchLotes() → GET /api/lotes
fetchVendas() → Prisma Query
    ↓
API retorna dados formatados
    ↓
React renderiza cards + listas
    ↓
Tailwind CSS aplica estilos
    ↓
Browser exibe Dashboard
```

### 2. Gerador de Relatórios

```
User acessa /adm/relatorios
    ↓
RelatoriosPage.tsx (Client Component)
    ↓
User seleciona filtros:
  - Tipo (Lotes, Vendas, Lucro, Análise Completa)
  - Data Início/Fim
  - Valor Mín/Máx
  - Ordenação
    ↓
User clica "Gerar Relatório"
    ↓
Envia: GET /api/relatorios?tipo=...&filtros=...
    ↓
API /api/relatorios executa:
  1. Busca dados do Prisma
  2. Filtra por data/valor
  3. Formata dados
  4. Calcula resumo estatístico
    ↓
RelatorioTable.tsx renderiza:
  - Tabela com dados
  - Resumo estatístico
  - Botões export (CSV/JSON)
    ↓
User pode:
  - Visualizar dados
  - Exportar CSV
  - Exportar JSON
```

### 3. Análise de Vendas com Gráficos

```
User acessa /adm/vendas/analise
    ↓
AnaliseVendasPage.tsx (Client Component)
    ↓
User configura:
  - Data Início/Fim
  - Tipo Gráfico (linha, barra, área, pizza)
  - Métricas (valor, quantidade, lucro, margem)
  - Agrupamento (data, lote, mês, semana)
  - Mostrar Tabela? (sim/não)
    ↓
User clica "Gerar Análise"
    ↓
Envia: GET /api/vendas/analise?config=...
    ↓
API executa:
  1. Busca vendas + Lotes do Prisma
  2. Agrupa dados (data/lote/mês/semana)
  3. Calcula métricas (lucro, margem)
  4. Formata para gráfico
  5. Cria tabela detalhada
  6. Calcula resumo
    ↓
GraficoVendas.tsx (Recharts):
  - Renderiza gráfico interativo
  - Suporta hover, zoom, legendas
  - 4 tipos (linha, barra, área, pizza)
    ↓
TabelaVendas.tsx:
  - Tabela com dados detalhados
  - Paginação (10 linhas/página)
  - Botão export CSV
    ↓
Cards de Resumo:
  - Total de vendas
  - Valor total
  - Lucro total
  - Margem média
```

---

## 🗄️ Modelos de Banco de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                      SCHEMA PRISMA                          │
└─────────────────────────────────────────────────────────────┘

User
├── id (PK)
├── name
├── email (UNIQUE)
├── senha
├── role (admin/peao)
└── createdAt

Lote
├── id (PK)
├── codigo
├── chegada
├── custo
├── data_venda (nullable)
├── vacinado
├── data_vacinacao (nullable)
└── Relations:
    ├── bois (1:N)
    ├── vendas (1:N)
    └── pesoHistorico (1:N)

Boi
├── id (PK)
├── peso
├── status
├── alerta (nullable)
├── loteId (FK)
└── Relations:
    ├── Lote (N:1)
    └── historico (1:N)

PesoHistorico
├── id (PK)
├── peso
├── dataPesagem
├── boiId (FK)
├── loteId (FK)
└── Relations:
    ├── Boi (N:1)
    └── Lote (N:1)

Venda
├── id (PK)
├── dataVenda
├── valor
├── loteId (FK)
└── Relations:
    └── Lote (N:1)
```

---

## 🔐 Fluxo de Autenticação

```
Sem Token
    ↓
User acessa /adm
    ↓
middleware.ts intercepta
    ↓
Verifica cookie auth_token
    ↓
Token não existe?
    ├─ Yes → Redireciona para / ❌
    └─ No  → Continua
    ↓
jwtVerify(token, SECRET)
    ↓
Token inválido?
    ├─ Yes → Redireciona para / ❌
    └─ No  → Continua
    ↓
Verifica role do usuário
    ├─ /adm → requer role="admin" ✅
    ├─ /peao → requer role="peao" ✅
    └─ outro → redireciona ❌
    ↓
NextResponse.next() → Permite acesso ✅
```

---

## 📡 APIs Implementadas

### 1. `/api/lotes` (GET/POST)

**GET** - Listar lotes com estatísticas
```
Resposta: Array de {
  id, codigo, chegada, custo, data_venda,
  vacinado, data_vacinacao,
  quantidadeBois, pesoMedio, pesoTotal
}
```

**POST** - Criar novo lote
```
Body: {
  codigo, chegada, custo, vacinado, data_vacinacao
}
Resposta: Lote criado
```

### 2. `/api/lotes/[id]` (GET/PUT)

**GET** - Detalhes de um lote
**PUT** - Atualizar lote

### 3. `/api/relatorios` (GET)

**GET** - Gerar relatório dinâmico
```
Parâmetros:
  - tipo: lotes | vendas | lucro | analise-completa
  - dataInicio, dataFim (opcional)
  - minValor, maxValor (opcional)
  - ordenarPor: data_asc | data_desc | valor_asc | valor_desc | nome_asc

Resposta: {
  dados: [...],
  resumo: {
    totalRegistros, valorTotal, lucroTotal, margemMédia, ...
  }
}
```

### 4. `/api/vendas/analise` (GET)

**GET** - Análise de vendas para gráficos
```
Parâmetros:
  - dataInicio, dataFim (opcional)
  - tipoGrafico: linha | barra | area | pizza
  - metricas: valor, quantidade, lucro, margem (CSV)
  - agrupadoPor: data | lote | mes | semana

Resposta: {
  grafico: [...dados agrupados...],
  tabela: [...dados detalhados...],
  resumo: {
    totalVendas, valorTotal, valorMedio, lucroTotal, margemMedia
  }
}
```

### 5. `/api/logout` (POST)

Remove token e redireciona para login

---

## 🎨 Componentes React

### Server Components (Renderização Servidor)
- `AdminHomePage` - Dashboard
- `AnaliseVendasPage` - Página análise (estrutura)
- `RelatoriosPage` - Página relatórios

### Client Components (Renderização Cliente)
- `RelatorioTable` - Tabela de relatórios
- `GraficoVendas` - Gráficos Recharts
- `TabelaVendas` - Tabela análise
- `Sidebar` - Menu lateral

### Bibliotecas Externas
- **Recharts**: Gráficos (linha, barra, área, pizza)
- **Lucide React**: Ícones
- **Tailwind CSS**: Estilos
- **Prisma**: ORM para BD
- **JWT**: Autenticação
- **bcryptjs**: Hash de senhas

---

## 🚀 Performance

| Métrica | Valor | Status |
|---------|-------|--------|
| Build | 1.5s | ✅ |
| Middleware | 214ms | ✅ |
| Servidor pronto | 1.5s | ✅ |
| First Paint | ~800ms | ✅ |
| Turbopack | Ativo | ✅ |

---

## 📝 Arquivos de Documentação

- `README.md` - Documentação geral
- `TESTE_SISTEMA.md` - Resultado dos testes
- `TESTES_DETALHADOS.md` - Checklist de testes
- `GUIA_TESTES_MANUAIS.md` - Como testar manualmente
- `ARQUITETURA.md` - Este arquivo

---

**Status**: 🟢 Sistema operacional  
**Data**: 10 de Novembro de 2025  
**Versão**: 0.1.0
