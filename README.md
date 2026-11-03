# Todo List

Aplicação de lista de tarefas com autenticação, em que cada usuário vê e gerencia apenas as próprias atividades.

## Tecnologias

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Clerk](https://clerk.com/) para autenticação
- [Prisma](https://www.prisma.io/) como ORM
- [shadcn/ui](https://ui.shadcn.com/) para os componentes de interface
- [Zod](https://zod.dev/) para validação

## Funcionalidades

- Cadastro e login com Clerk (Google)
- Criação de atividades com título obrigatório e descrição opcional
- Edição de atividades
- Marcação de atividade como concluída
- Exclusão de atividades, com confirmação
- Cada usuário acessa somente as próprias atividades

## Pré-requisitos

- Node.js 20 ou superior
- Uma conta no Clerk
- Um banco de dados compatível com o provider configurado em `prisma/schema.prisma`

## Instalação

1. Clone o repositório:

   ```bash
   git clone <url-do-repositorio>
   cd <nome-da-pasta>
   ```

2. Instale as dependências:

   ```bash
   bun install
   ```

3. Crie o arquivo `.env.local` na raiz do projeto:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/tasklist
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/tasklist

   DATABASE_URL="..."
   ```

   As chaves do Clerk ficam no painel do projeto, em **API Keys**. O valor de `DATABASE_URL` depende do banco escolhido.

4. Crie as tabelas no banco e gere o cliente do Prisma:

   ```bash
   bunx prisma migrate dev
   ```

5. Inicie o servidor de desenvolvimento:

   ```bash
   bun next ou bun run dev
   ```

6. Acesse [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run start` | Inicia a versão de produção |
| `npx prisma migrate dev` | Aplica as migrations no banco local |
| `npx prisma studio` | Abre uma interface para visualizar os dados |

## Estrutura

```
app/
├── (public)/               # Telas de entrada (sign-in e sign-up)
│   ├── layout.tsx          # Redireciona usuários logados para /tasklist
│   ├── sign-in/
│   └── sign-up/
└── (private)/              # Área protegida
    ├── layout.tsx          # Exige login e garante o usuário no banco
    └── tasklist/
        └── page.tsx        # Busca as tarefas do usuário

components/
├── actions/
│   └── tasks.ts            # Server actions: criar, editar, concluir e excluir
├── task-container/
│   └── task-container.tsx  # Lista de tarefas
├── task-input/
│   └── task-input-form.tsx # Formulário de criação e edição
└── ui/                     # Componentes do shadcn/ui

lib/
├── ensure-user.ts          # Cria o usuário no banco no primeiro acesso
├── prisma.ts               # Cliente do Prisma
└── validations/
    └── task.ts             # Schema de validação com Zod

prisma/
├── schema.prisma           # Modelos User e Task
└── migrations/             # Histórico de alterações do banco
```

## Como funciona

- **Autenticação:** o Clerk gerencia o login e o cadastro. Os layouts de `(public)` e `(private)` controlam o acesso: quem está logado é levado para a lista, e quem não está é levado para o login.
- **Sincronização com o banco:** a função `ensureUser` busca o usuário logado no Clerk e o cria na tabela `User` caso ainda não exista. O `id` do usuário no banco é o mesmo `userId` do Clerk.
- **Atividades:** as tarefas são gravadas por server actions. Toda operação filtra pelo `userId` do usuário logado, então ninguém consegue alterar ou excluir tarefas de outro usuário.
- **Conclusão:** o campo `completed` marca a tarefa como concluída. Tarefas concluídas não podem ser editadas.
- **Exclusão:** a tarefa é removida do banco de forma definitiva, após confirmação do usuário.

## Modelo de dados

```prisma
model User {
  id        String   @id
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  tasks     Task[]
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Observações

- O cliente do Prisma é gerado em `src/generated/prisma` e não é versionado. Ele é recriado com `bunx prisma generate`.
- Se o schema for alterado, crie uma nova migration com `bunx prisma migrate dev --name nome_da_mudanca`. Não edite migrations que já foram aplicadas.