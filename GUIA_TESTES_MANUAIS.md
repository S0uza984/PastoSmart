# 🧪 Guia de Testes Manuais - PastoSmart

## 📌 Status Atual
- ✅ Servidor rodando em `http://localhost:3000`
- ✅ Banco de dados configurado (MySQL + Prisma)
- ✅ Todas as rotas implementadas
- ✅ Componentes React compilados

---

## 🔐 TESTE 1: Autenticação e Login

### Objetivo
Verificar se o sistema protege as rotas e redireciona corretamente

### Passos

1. **Sem Autenticação**
   ```
   URL: http://localhost:3000/adm
   Esperado: Redireciona para http://localhost:3000/
   Motivo: Middleware rejeita sem token JWT
   ```

2. **Página de Login**
   ```
   URL: http://localhost:3000/
   Esperado: Formulário de login ou página inicial
   Campos: email, senha (se houver)
   ```

### ✅ Resultado Esperado
- Página redireciona se sem cookie `auth_token`
- Login funciona e define cookie
- Após login, acesso a `/adm` é permitido

---

## 📊 TESTE 2: Dashboard (Home Admin)

### Objetivo
Validar que o dashboard carrega dados e exibe estatísticas

### Passos

1. **Acesso à Página**
   ```
   URL: http://localhost:3000/adm
   Esperado: Dashboard com cards de estatísticas
   ```

2. **Verificar Cards**
   - 📍 Card 1: "Total de Lotes" (número)
   - 📍 Card 2: "Total de Bois" (número)
   - 📍 Card 3: "Total Vendas" (R$ formatado)
   - 📍 Card 4: "Lotes Vacinados" (número + %)

3. **Verificar Listas**
   - 📍 "Lotes Recentes" com:
     - Código do lote
     - Quantidade de bois
     - Data de chegada
     - Custo em R$
   
   - 📍 "Vendas Recentes" com:
     - Nome do lote
     - Data da venda
     - Valor em R$

### ✅ Verificações
- [ ] Cards carregam sem erros
- [ ] Números formatados corretamente (R$ com 2 casas decimais)
- [ ] Datas em formato brasileiro (dd/mm/yyyy)
- [ ] Se banco vazio, mostra "nenhum dado"

---

## 📋 TESTE 3: Gerador de Relatórios

### Objetivo
Validar a geração dinâmica de 4 tipos de relatórios

### Passos

1. **Acessar Página**
   ```
   URL: http://localhost:3000/adm/relatorios
   Esperado: Interface com filtros
   ```

2. **Teste Relatório de Lotes**
   ```
   1. Selecione tipo: "Lotes"
   2. Deixe datas em branco (sem filtro)
   3. Clique "Gerar Relatório"
   ```
   
   Esperado:
   - Tabela com colunas:
     - Código, Data Chegada, Qtd Bois
     - Peso Total (kg), Peso Médio (kg)
     - Custo (R$), Vacinado, Data Venda
   - Resumo: Custo Total, Qtd Total, Peso Médio Geral

3. **Teste Relatório de Vendas**
   ```
   1. Selecione tipo: "Vendas"
   2. Clique "Gerar Relatório"
   ```
   
   Esperado:
   - Tabela com:
     - Lote, Data Venda, Valor (R$)
     - Custo, Lucro (R$), Margem (%)
   - Resumo: Valor Total, Lucro Total, Margem Média

4. **Teste Análise de Lucro**
   ```
   1. Selecione tipo: "Lucro"
   2. Clique "Gerar Relatório"
   ```
   
   Esperado:
   - Tabela com:
     - Código, Qtd Bois, Custo
     - Valor Venda, Lucro Total, Margem, Lucro/Boi
   - Resumo: Lucro Total Geral, Margem Média, Lucro/Boi Médio

5. **Teste Filtros**
   ```
   1. Tipo: Vendas
   2. Data Início: [20 dias atrás]
   3. Data Fim: [hoje]
   4. Valor Mínimo: 5000
   5. Clique "Gerar Relatório"
   ```
   
   Esperado:
   - Apenas vendas no período e com valor ≥ 5000

6. **Teste Exportação**
   ```
   1. Após gerar relatório
   2. Clique "Exportar CSV"
   ```
   
   Esperado:
   - Arquivo baixa com nome: `relatorio-[tipo]-[data].csv`
   - Abre em Excel/Sheets sem erros

### ✅ Verificações
- [ ] Cada tipo de relatório mostra dados diferentes
- [ ] Filtros de data funcionam
- [ ] Filtros de valor funcionam
- [ ] Valores formatados (R$, %, datas)
- [ ] Resumo calcula agregações corretas
- [ ] Exportação CSV funciona

---

## 📈 TESTE 4: Análise de Vendas com Gráficos

### Objetivo
Validar gráficos interativos e múltiplas métricas

### Passos

1. **Acessar Página**
   ```
   URL: http://localhost:3000/adm/vendas/analise
   Esperado: Interface com filtros e seleção de métricas
   ```

2. **Teste Gráfico de Linha**
   ```
   Configuração:
   - Tipo de Gráfico: "Linha"
   - Métrica 1: ✓ Valor de Venda
   - Agrupar por: "Data"
   - Clique "Gerar Análise"
   ```
   
   Esperado:
   - Gráfico com linha azul
   - Eixo X: datas
   - Eixo Y: valores R$
   - Tooltip ao passar mouse

3. **Teste Múltiplas Métricas**
   ```
   Configuração:
   - Tipo: Linha
   - Métricas: ✓ Valor + ✓ Lucro + ✓ Margem
   - Agrupar por: "Lote"
   - Clique "Gerar Análise"
   ```
   
   Esperado:
   - 3 linhas de cores diferentes
   - Legenda explicando cada cor
   - Eixo Y secundário se escalas diferentes

4. **Teste Gráfico de Barra**
   ```
   Configuração:
   - Tipo: "Barra"
   - Métrica: ✓ Quantidade
   - Agrupar por: "Mês"
   - Clique "Gerar Análise"
   ```
   
   Esperado:
   - Barras agrupadas por mês
   - Altura representa quantidade
   - Cores consistentes

5. **Teste Gráfico de Pizza**
   ```
   Configuração:
   - Tipo: "Pizza"
   - Métrica: ✓ Valor de Venda
   - Clique "Gerar Análise"
   ```
   
   Esperado:
   - Gráfico em pizza com cores diferentes
   - Labels mostram valores
   - Legendas identificam fatias

6. **Teste Agrupamentos**
   ```
   Teste cada opção:
   - "Por Data" → Gráfico por data
   - "Por Lote" → Gráfico por código de lote
   - "Por Mês" → Agrupado em meses
   - "Por Semana" → Agrupado em semanas
   ```

7. **Teste Tabela Detalhada**
   ```
   1. Selecione: ✓ Mostrar tabela
   2. Gerar análise
   3. Verifique:
      - Cada venda em linha separada
      - Valores formatados
      - Paginação se > 10 linhas
   ```

8. **Teste Resumo Estatístico**
   ```
   Esperado (cards informativos):
   - Total de Vendas: [número]
   - Valor Total: R$ [formatado]
   - Valor Médio: R$ [formatado]
   - Lucro Total: R$ [formatado]
   - Margem Média: [%]
   ```

### ✅ Verificações
- [ ] Gráficos renderizam sem erros
- [ ] Interações (hover) funcionam
- [ ] Múltiplas séries aparecem juntas
- [ ] Agrupamentos mudam o gráfico
- [ ] Tabela pagina corretamente
- [ ] Resumo calcula valores certos

---

## 🔗 TESTE 5: Navegação e Sidebar

### Objetivo
Validar menu lateral e links de navegação

### Passos

1. **Verificar Menu**
   ```
   Items visíveis (admin):
   - 🏠 Início → /adm
   - 💰 Vendas → /adm/vendas
   - 📊 Análise Vendas → /adm/vendas/analise
   - 📋 Lotes → /adm/lote
   - 📄 Relatórios → /adm/relatorios
   - 🚪 Sair (logout)
   ```

2. **Testar Links**
   ```
   Clique em cada item e verifique se abre corretamente
   ```

3. **Teste Logout**
   ```
   1. Clique em "Sair"
   2. Esperado: Redireciona para /
   3. Cookie auth_token é removido
   ```

### ✅ Verificações
- [ ] Todos os links estão presentes
- [ ] Links vão para URLs corretas
- [ ] Item ativo é destacado
- [ ] Logout remove autenticação

---

## 🛠️ TESTE 6: Erros e Edge Cases

### Objetivo
Validar comportamento em situações especiais

### Passos

1. **Banco Vazio**
   ```
   Se não há dados:
   - Dashboard mostra 0 em cards
   - Listas vazias mostram "nenhum dado"
   - Relatórios geram mas tabelas vazias
   - Gráficos aparecem vazio
   ```

2. **Filtros Sem Resultados**
   ```
   1. Relatórios → Vendas
   2. Data Início: 01/01/2020
   3. Data Fim: 01/01/2021
   4. Gerar
   ```
   
   Esperado: Mensagem "nenhum resultado" ou tabela vazia

3. **Seleção Nenhuma Métrica**
   ```
   1. Análise Vendas
   2. Desmarque todas métricas
   3. Clique "Gerar Análise"
   ```
   
   Esperado: Erro "Selecione ao menos uma métrica"

### ✅ Verificações
- [ ] Sem dados: sistema não quebra
- [ ] Sem resultados: mensagem amigável
- [ ] Validações: erros informativos

---

## 📱 TESTE 7: Responsividade

### Objetivo
Validar layouts em diferentes tamanhos de tela

### Passos

1. **Mobile (375px)**
   - Abrir DevTools (F12)
   - Redimensionar para 375x667
   - Verificar:
     - Sidebar fica oculta (toggle burger menu)
     - Cards empilham verticalmente
     - Tabelas scrollam horizontalmente

2. **Tablet (768px)**
   - Redimensionar para 768x1024
   - Verificar:
     - 2 colunas de cards
     - Sidebar visível em tela grande

3. **Desktop (1920px)**
   - Redimensionar para 1920x1080
   - Verificar:
     - Todos os elementos visíveis
     - Espaçamento adequado

### ✅ Verificações
- [ ] Layout não quebra em mobile
- [ ] Texto legível em todas resoluções
- [ ] Gráficos responsivos
- [ ] Tabelas scrolláveis se necessário

---

## 🎯 Resumo de Testes

| Teste | Descrição | Status |
|-------|-----------|--------|
| 1 | Autenticação e Login | [ ] Passar |
| 2 | Dashboard | [ ] Passar |
| 3 | Relatórios | [ ] Passar |
| 4 | Análise Gráficos | [ ] Passar |
| 5 | Navegação | [ ] Passar |
| 6 | Erros/Edge Cases | [ ] Passar |
| 7 | Responsividade | [ ] Passar |

---

## 📞 Notas Importantes

1. **Banco Vazio**: Se o banco não tiver dados, use dados de teste
2. **Erros 500**: Verifique logs do servidor
3. **Erros de Console**: Abra DevTools (F12) e verifique aba "Console"
4. **Performance**: Abra "Network" para medir tempos de resposta

---

**Servidor**: http://localhost:3000  
**Data**: 10 de Novembro de 2025  
**Última Atualização**: $(date)
