# 💰 Guia Completo - Sistema de Vendas PastoSmart

**Data**: 11 de Novembro de 2025  
**Versão**: 1.0

---

## 📋 Resumo

O sistema de vendas do PastoSmart permite **registrar e acompanhar todas as vendas de lotes de gado**, incluindo:

✅ Registro de novas vendas  
✅ Cálculo automático de lucro e margem  
✅ Histórico completo de vendas  
✅ Estatísticas em tempo real  
✅ Filtros e exportação de dados  

---

## 🚀 Como Funciona

### Fluxo Básico

```
1. Você cadastra um LOTE (grupo de gado)
   ├─ Código do lote
   ├─ Data de chegada
   ├─ Custo total
   └─ Quantidade de bois

2. Você seleciona o lote em "Registrar Nova Venda"
   ├─ Seleciona o lote no dropdown
   ├─ Define a data da venda (opcional)
   ├─ Digite o valor de venda
   └─ Vê o lucro calculado automaticamente

3. Sistema calcula:
   ├─ Lucro = Valor Venda - Custo
   ├─ Margem = (Lucro / Custo) × 100
   └─ Atualiza tudo em tempo real

4. Venda fica registrada no histórico
   ├─ Com todos os dados
   ├─ Acessível para análise
   └─ Pronta para relatórios
```

---

## 📍 Acessando o Sistema de Vendas

### Via Navegação

```
1. Faça login em http://localhost:3000
2. Clique no avatar/menu
3. Vá até "Dashboard Admin" (ou /adm)
4. Na sidebar, clique em "Vendas" ou acesse /adm/vendas
```

### URL Direta

```
http://localhost:3000/adm/vendas
```

---

## 📊 Tela de Vendas - Componentes Principais

### 1. Cards de Resumo (Topo)

```
┌─────────────────────────────────────────────────────────────┐
│  4 Cards de Estatísticas em Tempo Real                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🟢 Lotes Vendidos    🔵 Valor Total    🟡 Lucro Total    🟣 Lotes Disponíveis
│     X lotes            R$ Y,YYY.YY       R$ Z,ZZZ.ZZ          X lotes
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**O que significa cada card:**

| Card | Explicação |
|------|-----------|
| **Lotes Vendidos** | Quantidade de lotes já comercializados |
| **Valor Total** | Soma de todas as vendas realizadas |
| **Lucro Total** | Valor das vendas menos custos dos lotes |
| **Lotes Disponíveis** | Quantidade de lotes prontos para vender |

---

### 2. Formulário "Registrar Nova Venda"

```
┌──────────────────────────────────────────────────────────────┐
│  📝 Registrar Nova Venda                                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  📦 Lote a Vender *              📅 Data da Venda            │
│  [Dropdown - Selecione lote]     [Data Input]               │
│                                  (opcional)                  │
│                                                               │
│  💰 Valor de Venda (R$) *                                    │
│  [Número Input com 2 casas decimais]                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Informações do Lote Selecionado (mostrado se selecionado)│ │
│  │ Custo: R$ X,XXX.XX  |  Bois: X  |  Lucro: R$ X,XXX  |  Margem: X%│
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  [✅ Registrar Venda]                                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Campos Obrigatórios:**
- ⭐ **Lote a Vender** - Selecione na lista
- ⭐ **Valor de Venda** - Digite em reais

**Campos Opcionais:**
- 📅 **Data da Venda** - Se deixar vazio, usa a data atual

---

### 3. Pré-visualização do Lucro

Quando você seleciona um lote e digita o valor, vê imediatamente:

```
┌────────────────────────────────────────────┐
│  Custo do Lote: R$ 10,000.00              │
│  Quantidade de Bois: 50                   │
│  Lucro Estimado: R$ 2,000.00 ✅           │
│  Margem Estimada: 20.00% 📈               │
└────────────────────────────────────────────┘
```

---

### 4. Histórico de Vendas (Tabela)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📊 Histórico de Vendas                              Total de 5 vendas      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Data        │ Lote      │ Custo       │ Valor Venda │ Lucro       │ Margem │
├─────────────────────────────────────────────────────────────────────────────┤
│  11/11/2025  │ LOTE-001  │ R$ 10.000  │ R$ 12.000  │ R$ 2.000   │ 20%   │
│  10/11/2025  │ LOTE-002  │ R$ 15.000  │ R$ 18.500  │ R$ 3.500   │ 23%   │
│  09/11/2025  │ LOTE-003  │ R$ 8.000   │ R$ 9.600   │ R$ 1.600   │ 20%   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Colunas:**
- **Data**: Quando foi vendido
- **Lote**: Código do lote
- **Custo**: Quanto custou trazer o lote
- **Valor Venda**: Pelo quanto foi vendido
- **Lucro**: Diferença (Venda - Custo)
- **Margem**: Lucro em percentual

---

## 🎯 Passo-a-Passo: Registrar sua Primeira Venda

### Pré-requisito

Você precisa ter pelo menos **1 lote cadastrado** no sistema.

Se não tiver, vá até `/adm/lote/novo-lote` e crie um lote.

### Passos

#### 1️⃣ Abra a Página de Vendas

```
URL: http://localhost:3000/adm/vendas
```

Você verá a tela com 4 cards vazios e o formulário.

---

#### 2️⃣ Selecione o Lote

```
Clique no dropdown "📦 Lote a Vender"
↓
Lista mostra todos os lotes disponíveis (não vendidos)
↓
Selecione um lote
```

**Exemplo:**
```
LOTE-001 (Custo: R$ 10.000,00)
LOTE-002 (Custo: R$ 15.000,00)
LOTE-003 (Custo: R$ 8.000,00)
```

---

#### 3️⃣ Defina a Data da Venda (Opcional)

```
Campo: "📅 Data da Venda"

Se deixar vazio → usa data atual
Se preenchido → usa data digitada
```

**Exemplo:**
```
[2025-11-15]  ← Clique para abrir calendário
```

---

#### 4️⃣ Digite o Valor da Venda

```
Campo: "💰 Valor de Venda (R$)"

Valor deve ser maior que 0
Use ponto (.) ou vírgula (,) para decimal
```

**Exemplo:**
```
[12000.00]  ← Será vendido por R$ 12.000,00
```

---

#### 5️⃣ Veja o Lucro Calculado

Assim que você preenche o valor, aparece:

```
┌─────────────────────────────────┐
│ Lucro Estimado: R$ 2.000,00 ✅  │
│ Margem Estimada: 20.00% 📈      │
└─────────────────────────────────┘
```

---

#### 6️⃣ Clique em "✅ Registrar Venda"

```
Botão ficará com loading enquanto processa
↓
Mensagem de sucesso aparece (verde)
↓
Venda fica registrada no histórico
↓
Lote sai da lista de disponíveis
↓
Formulário limpa automaticamente
```

---

#### 7️⃣ Confirmação

Você verá uma mensagem:

```
┌──────────────────────────────────────────┐
│ ✅ Venda registrada com sucesso!         │
└──────────────────────────────────────────┘
```

E os cards serão atualizados:
```
Lotes Vendidos: 1 (antes era 0)
Valor Total: R$ 12.000,00
Lucro Total: R$ 2.000,00
Lotes Disponíveis: 2 (antes era 3)
```

---

## 💡 Dicas Práticas

### 1. Vendas com Lucro Negativo

Você pode vender por menos do que custou:

```
Custo: R$ 10.000,00
Valor: R$ 9.000,00
Lucro: -R$ 1.000,00 (prejuízo)
Margem: -10.00% 🔴
```

Sistema avisa em vermelho.

---

### 2. Ver Margem de Lucro

**Fórmula:**
```
Margem (%) = (Lucro ÷ Custo) × 100
```

**Exemplo:**
```
Custo: R$ 10.000
Venda: R$ 12.000
Lucro: R$ 2.000
Margem: (2.000 ÷ 10.000) × 100 = 20%
```

Margem de 20% = bom negócio!

---

### 3. Validações do Sistema

O sistema valida:

| Validação | Mensagem de Erro |
|-----------|-----------------|
| Campo vazio | "Preencha todos os campos obrigatórios" |
| Valor ≤ 0 | "Valor deve ser maior que zero" |
| Lote não encontrado | "Erro ao registrar venda" |
| Sem lotes disponíveis | "Nenhum lote disponível para vender" |

---

## 📊 Análise de Vendas

Após registrar vendas, você pode analisar em `/adm/vendas/analise`:

```
1. Vá para "Análise Vendas" no sidebar
2. Configure filtros:
   - Data início/fim
   - Tipo de gráfico (linha, barra, área, pizza)
   - Métricas (valor, quantidade, lucro, margem)
   - Agrupamento (data, lote, mês, semana)
3. Clique "Gerar Análise"
4. Veja gráficos e tabelas
```

---

## 📋 Gerador de Relatórios

Para relatórios de vendas, vá para `/adm/relatorios`:

```
1. Selecione "💰 Vendas" como tipo
2. Defina filtros (data, valor)
3. Clique "Gerar Relatório"
4. Veja tabela formatada
5. Exporte CSV ou JSON
```

---

## 🔧 Troubleshooting

### Problema: "Nenhum lote disponível para vender"

**Causa:** Todos os lotes já foram vendidos.

**Solução:**
1. Vá para `/adm/lote/novo-lote`
2. Crie um novo lote
3. Volte para vendas e tente novamente

---

### Problema: Não consigo selecionar o lote

**Causa:** Lista vazia

**Solução:**
1. Certifique-se que tem lotes cadastrados
2. Refresque a página (F5)
3. Cheque o console (F12) para erros

---

### Problema: Valor não é aceito

**Causa:** Valor inválido

**Solução:**
- Use apenas números
- Não use símbolos de moeda (R$, etc)
- Valor deve ser positivo (> 0)
- Exemplo válido: `12000.50`

---

## 📊 Integração com Outros Sistemas

### Dashboard Principal

O dashboard `/adm` mostra:
- Total de Bois do rebanho
- Total de Vendas em R$
- Últimas vendas realizadas

Dados vêm do sistema de vendas.

---

### Relatórios

Sistema de relatórios usa dados de vendas para:
- Relatório de Vendas
- Análise de Lucro
- Análise Completa

---

## 🎓 Exemplos Práticos

### Exemplo 1: Venda Simples

```
CENÁRIO:
  Lote: LOTE-001
  Custo: R$ 10.000,00
  Bois: 50

OPERAÇÃO:
  Data: 11/11/2025
  Valor: R$ 12.000,00

RESULTADO:
  Lucro: R$ 2.000,00
  Margem: 20%
  Status: ✅ Sucesso
```

---

### Exemplo 2: Múltiplas Vendas

```
VENDAS:
  1. LOTE-001: R$ 10k → R$ 12k (Lucro: +R$ 2k)
  2. LOTE-002: R$ 15k → R$ 18k (Lucro: +R$ 3k)
  3. LOTE-003: R$ 8k → R$ 9k (Lucro: +R$ 1k)

TOTALIZANDO:
  Lotes Vendidos: 3
  Valor Total: R$ 39.000,00
  Lucro Total: R$ 6.000,00
  Margem Média: 21.3%
```

---

### Exemplo 3: Venda com Prejuízo

```
CENÁRIO:
  Custo: R$ 10.000,00
  Venda: R$ 9.000,00 (por conta de mercado baixo)

RESULTADO:
  Lucro: -R$ 1.000,00 🔴
  Margem: -10.00% 📉

NOTA:
  Sistema aceita, mas marca em vermelho
  Útil para análise pós-venda
```

---

## 🔐 Segurança

### Autenticação

Apenas usuários logados podem:
- Ver página de vendas
- Registrar vendas
- Acessar histórico

---

### Validação de Dados

Sistema valida:
- Tipo de dados (numbers, dates)
- Valores válidos (positivos)
- Lotes existentes
- Campos obrigatórios

---

## 📱 Responsividade

Página funciona em:

| Dispositivo | Visualização |
|------------|-------------|
| **Mobile** | 1 coluna, stacked |
| **Tablet** | 2 colunas |
| **Desktop** | 4 colunas |

Teste redimensionando a janela.

---

## 🚀 Próximos Passos

Após registrar vendas:

1. ✅ Visualizar no Dashboard
2. ✅ Gerar Relatórios
3. ✅ Criar Análises com Gráficos
4. ✅ Exportar dados (CSV/JSON)
5. 🔮 Integrar com sistema de pagamentos (futuro)

---

## 📞 Suporte

**Dúvidas?**

1. Veja documentação em `ARQUITETURA.md`
2. Consulte `RESUMO_PROJETO.md`
3. Abra uma issue no GitHub

---

**Status**: ✅ Pronto para Uso

**Última Atualização**: 11 de Novembro de 2025
