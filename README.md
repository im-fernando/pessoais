# 🚀 API Fastify - Teste

Uma API simples e interessante construída com Fastify e TypeScript, contendo várias rotas úteis para testes e desenvolvimento.

## 📋 Funcionalidades

### 📝 Tarefas (CRUD Completo)
- **GET** `/api/tarefas` - Listar todas as tarefas (com filtros opcionais)
- **GET** `/api/tarefas/:id` - Buscar tarefa por ID
- **POST** `/api/tarefas` - Criar nova tarefa
- **PUT** `/api/tarefas/:id` - Atualizar tarefa
- **DELETE** `/api/tarefas/:id` - Deletar tarefa
- **GET** `/api/tarefas/stats` - Estatísticas das tarefas

### 🛠️ Utilidades
- **GET** `/api/utilidades/uuid` - Gerar UUID(s) v4
- **POST** `/api/utilidades/hash` - Gerar hash de texto (MD5, SHA1, SHA256, SHA512)
- **GET** `/api/utilidades/senha` - Gerar senha aleatória customizável
- **POST** `/api/utilidades/converter` - Converter texto (Base64, Hex, Uppercase, Lowercase, Reverse)
- **POST** `/api/utilidades/analisar-texto` - Análise completa de um texto

### 💻 Sistema
- **GET** `/api/sistema/info` - Informações gerais do sistema
- **GET** `/api/sistema/memoria` - Informações detalhadas de memória
- **GET** `/api/sistema/cpus` - Informações das CPUs
- **GET** `/api/sistema/rede` - Informações de rede
- **GET** `/api/sistema/health` - Health check
- **GET** `/api/sistema/processo` - Informações do processo Node.js

## 🚀 Como usar

### Instalação

```bash
npm install
```

### Executar

```bash
# Compilar TypeScript
npm run build

# Modo produção (após compilar)
npm start

# Modo desenvolvimento (com watch e hot-reload)
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 📖 Exemplos de Uso

### Criar uma tarefa

```bash
curl -X POST http://localhost:3000/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Aprender Fastify",
    "descricao": "Estudar a documentação do Fastify",
    "prioridade": "alta",
    "status": "em_andamento"
  }'
```

### Gerar UUID

```bash
curl http://localhost:3000/api/utilidades/uuid?quantidade=3
```

### Gerar hash SHA256

```bash
curl -X POST http://localhost:3000/api/utilidades/hash \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "minha senha secreta",
    "algoritmo": "sha256"
  }'
```

### Gerar senha aleatória

```bash
curl "http://localhost:3000/api/utilidades/senha?tamanho=20&incluirSimbolos=true"
```

### Informações do sistema

```bash
curl http://localhost:3000/api/sistema/info
```

### Health check

```bash
curl http://localhost:3000/api/sistema/health
```

## 🎯 Estrutura do Projeto

```
.
├── src/
│   ├── server.ts           # Servidor principal
│   └── routes/
│       ├── tarefas.ts     # Rotas de tarefas
│       ├── utilidades.ts  # Rotas de utilidades
│       └── sistema.ts     # Rotas de sistema
├── dist/                  # Código compilado (gerado)
├── tsconfig.json          # Configuração TypeScript
├── package.json
└── README.md
```

## 📝 Notas

- As tarefas são armazenadas em memória (não persistem após reiniciar o servidor)
- CORS está habilitado para todas as origens
- Todas as rotas têm validação de schema quando necessário
- O servidor usa logging automático do Fastify
- Projeto escrito em TypeScript com tipagem forte

## 🛠️ Tecnologias

- **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Superset JavaScript com tipagem estática
- **@fastify/cors** - Plugin CORS para Fastify
- **Node.js** - Runtime JavaScript
- **tsx** - Executor TypeScript para desenvolvimento

## 📄 Licença

MIT

