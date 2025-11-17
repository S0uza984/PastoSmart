# PastoSmart

Sistema de gestão de gado para controle de lotes, pesagens, vacinações e vendas.

## Sobre o Projeto

O PastoSmart é uma aplicação web desenvolvida para gerenciar a criação de gado, permitindo:

- **Gestão de Lotes**: Cadastro e acompanhamento de lotes de gado
- **Controle de Bois**: Registro individual de animais com histórico de pesagens
- **Vacinação**: Controle de vacinações por lote
- **Vendas**: Registro de vendas com cálculo automático de lucro líquido
- **Análise de Vendas**: Relatórios e gráficos de desempenho
- **Alertas**: Notificações quando lotes atingem peso médio configurado para venda
- **Relatórios**: Geração de relatórios em Excel

O sistema possui dois níveis de acesso:
- **Administrador**: Acesso completo a todas as funcionalidades
- **Peão**: Acesso limitado para registro de dados operacionais

## Tecnologias

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para MySQL
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos e visualizações
- **JWT** - Autenticação e autorização

## Requisitos

- Node.js 20 ou superior
- MySQL 8.0 ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd PastoSmart
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/pastosmart"
JWT_SECRET="sua-chave-secreta-jwt-aqui"
NODE_ENV="production"
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate deploy
```

5. Gere o cliente Prisma:
```bash
npx prisma generate
```

## Executando Localmente

Para desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Build de Produção

1. Gere o build:
```bash
npm run build
```

2. Inicie o servidor:
```bash
npm start
```

## Deploy

### Vercel (Recomendado)

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Configure o projeto:
```bash
vercel
```

4. Configure as variáveis de ambiente no painel da Vercel:
   - `DATABASE_URL`: String de conexão MySQL
   - `JWT_SECRET`: Chave secreta para JWT (use uma string aleatória forte)
   - `NODE_ENV`: `production`

5. Execute as migrações após o primeiro deploy:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

### Outros Provedores

Para deploy em outros provedores (Railway, Render, AWS, etc.):

1. Configure as variáveis de ambiente no painel do provedor
2. Execute o build: `npm run build`
3. Configure o comando de start: `npm start`
4. Execute as migrações do Prisma após o primeiro deploy

**Importante**: Certifique-se de que o banco de dados MySQL está acessível a partir do ambiente de produção.

### Variáveis de Ambiente Obrigatórias

- `DATABASE_URL`: String de conexão MySQL no formato `mysql://usuario:senha@host:porta/database`
- `JWT_SECRET`: Chave secreta para assinatura de tokens JWT (mínimo 32 caracteres recomendado)

### Variáveis Opcionais

- `NODE_ENV`: Ambiente de execução (`development` ou `production`)
- `NEXT_PUBLIC_API_URL`: URL base da API (padrão: `http://localhost:3000`)

## Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas principais:

- `User`: Usuários do sistema (admin/peão)
- `Lote`: Lotes de gado
- `Boi`: Animais individuais
- `PesoHistorico`: Histórico de pesagens
- `Venda`: Registro de vendas
- `Configuracao`: Configurações do sistema

## Primeiro Acesso

Após o deploy, crie o primeiro usuário administrador através da API ou diretamente no banco de dados:

```sql
INSERT INTO User (name, email, senha, role) 
VALUES ('Admin', 'admin@example.com', 'senha123', 'admin');
```

**Nota**: Em produção, implemente hash de senhas (bcrypt) antes de criar usuários.

## Suporte

Para problemas ou dúvidas, consulte a documentação do Next.js e Prisma.
