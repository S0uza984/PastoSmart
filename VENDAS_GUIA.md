# 💰 Guia do Sistema de Vendas - PastoSmart

## 📝 O Que Foi Implementado

Um sistema **completo e funcional de vendas** que permite registrar a venda de lotes cadastrados no banco de dados, com cálculo automático de lucro e margem.

---

## 🎯 Funcionalidades Principais

### 1. **Página de Vendas** (`/adm/vendas`)

A página mostra:

#### ✅ **Cards de Resumo (4)**
- 📦 **Lotes Vendidos** → Quantidade de lotes já comercializados
- 💰 **Valor Total** → Soma de todas as vendas em R$
- 📈 **Lucro Total** → Lucro bruto (Valor Venda - Custo)
- 🟣 **Lotes Disponíveis** → Quantos lotes ainda estão prontos para vender

#### ✅ **Formulário de Registro de Venda**
- **Seleção de Lote**: Dropdown com apenas lotes NÃO VENDIDOS
  - Mostra: Código + Custo do lote
  - Evita vender o mesmo lote 2 vezes
- **Data da Venda**: Campo date (opcional, usa data atual se vazio)
- **Valor de Venda**: Campo number com validação (> 0)
- **Cálculo Automático**:
  - Lucro = Valor Venda - Custo Lote
  - Margem = (Lucro / Custo) × 100%
  - Exibe em tempo real enquanto digita

#### ✅ **Tabela de Histórico de Vendas**
Mostra todas as vendas com:
- 📅 Data da venda
- 📦 Código do lote
- 💵 Custo do lote
- 💰 Valor de venda
- 📈 Lucro (em verde)
- 📊 Margem de lucro (em %)

---

## 🔌 APIs Criadas

### **POST `/api/vendas`** - Registrar Nova Venda

**Request:**
```json
{
  "loteId": 1,
  "dataVenda": "2025-11-11",  // opcional
  "valor": 85000.00
}
```

**Validações:**
- ✅ Lote obrigatório
- ✅ Valor obrigatório (> 0)
- ✅ Lote deve existir
- ✅ Lote não pode estar já vendido
- ✅ Atualiza automaticamente `data_venda` no Lote

**Response (201 - Sucesso):**
```json
{
  "message": "Venda registrada com sucesso",
  "venda": {
    "id": 1,
    "dataVenda": "2025-11-11T00:00:00.000Z",
    "valor": 85000,
    "loteId": 1,
    "lote": {
      "id": 1,
      "codigo": "LOTE-001",
      "chegada": "2025-11-01T00:00:00.000Z",
      "custo": 50000,
      "vacinado": true,
      "quantidadeBois": 10
    },
    "lucro": 35000,
    "margemLucro": "70.00"
  }
}
```

**Response (400 - Erro):**
```json
{
  "message": "Este lote já foi vendido"
}
```

---

### **GET `/api/vendas`** - Listar Todas as Vendas

**Response:**
```json
[
  {
    "id": 1,
    "dataVenda": "2025-11-11T00:00:00.000Z",
    "valor": 85000,
    "loteId": 1,
    "lote": {
      "id": 1,
      "codigo": "LOTE-001",
      "chegada": "2025-11-01T00:00:00.000Z",
      "custo": 50000,
      "vacinado": true,
      "quantidadeBois": 10
    },
    "lucro": 35000,
    "margemLucro": "70.00"
  }
]
```

---

## 📱 Fluxo de Uso

### Passo 1: Acessar Página de Vendas
```
http://localhost:3000/adm/vendas
```

### Passo 2: Página Carrega Dados do Banco
1. Busca `/api/lotes` → pega todos os lotes
2. Filtra apenas lotes onde `data_venda = null` (não vendidos)
3. Busca `/api/vendas` → pega histórico de vendas
4. Exibe cards com totalizadores

### Passo 3: Preencher Formulário
1. Selecione um lote do dropdown
2. Veja automaticamente o custo e estimativa de lucro
3. Escolha uma data (opcional)
4. Digite o valor de venda
5. Clique "✅ Registrar Venda"

### Passo 4: Confirmação
- ✅ Se sucesso: Mensagem verde + lote removido do dropdown + adicionado ao histórico
- ❌ Se erro: Mensagem vermelha com motivo (ex: "Lote já foi vendido")

### Passo 5: Visualizar Histórico
- Tabela atualiza automaticamente com a nova venda
- Mostra lucro e margem calculados

---

## 💡 Exemplos Práticos

### Exemplo 1: Vender um Lote com Lucro

**Cenário:**
- Lote LOTE-001 chegou em 01/11/2025
- Custo total: R$ 50.000
- Vamos vender por: R$ 85.000

**Ação:**
1. Seleciona LOTE-001 (Custo: R$ 50.000,00)
2. Data: 11/11/2025
3. Valor: 85000
4. Sistema calcula:
   - Lucro: 85.000 - 50.000 = **R$ 35.000**
   - Margem: (35.000 / 50.000) × 100 = **70%**

**Resultado:** Venda registrada, lote marcado como vendido no banco

---

### Exemplo 2: Tentar Vender Lote Já Vendido

**Cenário:**
- Você tenta vender LOTE-001 novamente

**Ação:**
1. Seleciona LOTE-001 (mas ele não aparece no dropdown porque já foi vendido)
2. Se conseguir selecionar via outro meio:
   - Clica "Registrar Venda"
   - Sistema retorna erro: **"Este lote já foi vendido"**

---

## 🗄️ Estrutura do Banco de Dados

### Modelo **Venda** (Criado/Atualizado)

```prisma
model Venda {
  id        Int      @id @default(autoincrement())
  dataVenda DateTime @default(now())    // Data da venda
  valor     Float                       // Preço de venda
  
  // Relação
  loteId    Int
  Lote      Lote     @relation(fields: [loteId], references: [id])
}
```

### Modelo **Lote** (Campo Adicionado)

```prisma
model Lote {
  id           Int       @id @default(autoincrement())
  codigo       String
  chegada      DateTime
  custo        Float
  data_venda   DateTime?  // ← MARCA QUANDO FOI VENDIDO
  vacinado     Boolean   @default(false)
  data_vacinacao DateTime?
  
  // Relações
  bois         Boi[]
  vendas       Venda[]    // Lista de vendas deste lote
  pesoHistorico PesoHistorico[]
}
```

---

## 🔄 Fluxo de Dados

```
┌────────────────────────────────────────────┐
│       USUÁRIO ACESSA /adm/vendas           │
└─────────────┬──────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────┐
│   Página Carrega (useEffect com fetch)     │
│   GET /api/lotes                           │
│   GET /api/vendas                          │
└─────────────┬──────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────┐
│  Renderiza:                                │
│  - Cards com totalizadores                 │
│  - Dropdown com lotes não vendidos         │
│  - Tabela com vendas anteriores            │
└─────────────┬──────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────┐
│  USUÁRIO PREENCHE FORMULÁRIO               │
│  - Seleciona lote                          │
│  - Digita valor                            │
│  - Clica "Registrar"                       │
└─────────────┬──────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────┐
│  POST /api/vendas                          │
│  Validações:                               │
│  ✓ Lote existe?                            │
│  ✓ Lote já vendido?                        │
│  ✓ Valor > 0?                              │
└─────────────┬──────────────────────────────┘
              │
          ┌───┴───┐
          │       │
          ▼       ▼
    ✅ SUCESSO  ❌ ERRO
          │       │
          ▼       ▼
    ┌─────────┐ ┌──────────┐
    │ Criar   │ │ Retorna  │
    │ Venda   │ │ Mensagem │
    │ no BD   │ │ de Erro  │
    └────┬────┘ └────┬─────┘
         │           │
         ▼           ▼
    ┌─────────────────────────┐
    │ Atualiza:               │
    │ - Lista de vendas       │
    │ - Cards totalizadores   │
    │ - Remove lote do select │
    │ - Mensagem de sucesso   │
    └─────────────────────────┘
```

---

## 🧪 Como Testar

### Teste 1: Registrar Primeira Venda

```bash
# 1. Certifique-se que há lotes cadastrados
GET http://localhost:3000/api/lotes

# 2. Acesse a página
http://localhost:3000/adm/vendas

# 3. Selecione um lote, digite valor, clique registrar
# 4. Deve aparecer mensagem verde "✅ Venda registrada"
```

### Teste 2: Visualizar Histórico

```bash
# GET todas as vendas
GET http://localhost:3000/api/vendas

# Deve retornar array com vendas e cálculos de lucro/margem
```

### Teste 3: Tentar Vender Lote Duas Vezes

```bash
# 1. Registre uma venda para LOTE-001
# 2. Recarregue a página (/adm/vendas)
# 3. LOTE-001 NÃO deve aparecer no dropdown
# 4. Tente fazer POST para /api/vendas com loteId=1 novamente
# Retorna erro: "Este lote já foi vendido"
```

### Teste 4: Validação de Valor

```bash
# Tente registrar venda com valor inválido
POST /api/vendas
{
  "loteId": 1,
  "valor": -5000
}

# Retorna erro: "Valor deve ser maior que zero"
```

---

## 📊 Cálculos de Lucro

### Fórmula 1: Lucro Simples
```
Lucro = Valor Venda - Custo Lote
Exemplo: 85.000 - 50.000 = 35.000
```

### Fórmula 2: Margem de Lucro (%)
```
Margem = (Lucro / Custo) × 100
Exemplo: (35.000 / 50.000) × 100 = 70%
```

### Fórmula 3: Lucro Médio por Animal
```
Lucro por Boi = Lucro Total / Quantidade Bois
Exemplo: 35.000 / 10 = 3.500 por boi
```

---

## ⚠️ Importante

### O Que Acontece ao Vender um Lote?

1. **Cria registro em Venda** com:
   - `loteId` → ID do lote
   - `dataVenda` → Data da transação
   - `valor` → Preço de venda

2. **Atualiza Lote** com:
   - `data_venda` → Marca que foi vendido
   - Isso impede que o lote apareça novamente no dropdown

3. **Não Deleta Bois** - Os animais continuam associados ao lote para auditoria

### Dados que Permanecem no Histórico

- Custo original do lote
- Quantidade de bois
- Data de chegada
- Status de vacinação
- Todas as pesagens anteriores

Isso permite análise histórica completa!

---

## 🎯 Próximos Passos (Roadmap)

### v0.2.0
- [ ] Editar vendas registradas
- [ ] Remover vendas com confirmação
- [ ] Filtro de vendas por período
- [ ] Gráfico de vendas por mês

### v0.3.0
- [ ] Integração com análise de vendas
- [ ] Relatório de vendas em PDF
- [ ] Exportar histórico em Excel
- [ ] Dashboard de tendências de preço

### v1.0.0
- [ ] Previsão de preço de venda (ML)
- [ ] Alertas de lotes prontos para vender
- [ ] Integração com sistema financeiro
- [ ] API GraphQL para vendas

---

## 📞 Troubleshooting

### Problema: "Nenhum lote disponível para vender"
**Solução:** Certifique-se de que há lotes cadastrados em `/api/lotes` que ainda não foram vendidos

### Problema: Lote não aparece no dropdown
**Solução:** O lote pode já ter sido vendido. Verifique se `data_venda` é null no banco

### Problema: Valor não valida corretamente
**Solução:** Verifique se está usando número (ex: 50000) e não string (ex: "50000")

### Problema: Erro 500 na API
**Solução:** Verifique:
1. Se Prisma Client está gerando corretamente
2. Se `DATABASE_URL` está configurada
3. Os logs do servidor (console do dev)

---

## 📝 Checklist de Funcionalidades

- [x] API GET `/api/vendas` - listar vendas
- [x] API POST `/api/vendas` - registrar venda
- [x] Validação de lote existente
- [x] Validação de lote já vendido
- [x] Validação de valor > 0
- [x] Cálculo de lucro
- [x] Cálculo de margem
- [x] UI responsiva com cards
- [x] Formulário com validação
- [x] Tabela de histórico
- [x] Mensagens de sucesso/erro
- [x] Dropdown com lotes disponíveis
- [x] Atualização automática de data_venda no Lote

---

**Status:** 🟢 **Pronto para Uso**  
**Data:** 11 de Novembro de 2025  
**Versão:** v0.1.0 (Sistema de Vendas)
