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

## 📚 Documentação da API

A API possui documentação interativa completa usando Swagger/OpenAPI e Scalar:

- **Swagger UI**: `http://localhost:3000/documentation` - Interface Swagger tradicional
- **Scalar UI**: `http://localhost:3000/api-reference` - Interface moderna e elegante do Scalar
- **OpenAPI JSON**: `http://localhost:3000/documentation/json` - Especificação OpenAPI em JSON

A documentação inclui:
- Descrições detalhadas de todas as rotas
- Schemas de requisição e resposta
- Exemplos de uso
- Parâmetros e filtros disponíveis
- Códigos de status HTTP

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
├── Dockerfile             # Configuração Docker
├── docker-compose.yml     # Configuração Docker Compose
├── deploy.sh              # Script de deploy automatizado
├── .dockerignore          # Arquivos ignorados no build Docker
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
- Documentação OpenAPI completa com Swagger e Scalar UI
- Todas as rotas estão documentadas com exemplos e schemas detalhados

## 🛠️ Tecnologias

- **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Superset JavaScript com tipagem estática
- **@fastify/cors** - Plugin CORS para Fastify
- **@fastify/swagger** - Geração automática de documentação OpenAPI
- **@fastify/swagger-ui** - Interface Swagger UI para visualização da documentação
- **@scalar/fastify-api-reference** - Interface Scalar moderna para documentação da API
- **Node.js** - Runtime JavaScript
- **tsx** - Executor TypeScript para desenvolvimento

## 🐳 Deploy com Docker

### Deploy Automatizado (Recomendado)

Para fazer deploy no Umbrel OS ou qualquer servidor Linux com Docker:

```bash
# 1. Clone ou copie o projeto para o servidor
git clone <seu-repositorio> # ou copie os arquivos via SCP/SFTP

# 2. Entre no diretório do projeto
cd fastify-api-teste

# 3. Execute o script de deploy
chmod +x deploy.sh
./deploy.sh
```

O script irá:
- ✅ Verificar se Docker e Docker Compose estão instalados
- ✅ Parar containers existentes
- ✅ Construir a imagem Docker
- ✅ Iniciar o container
- ✅ Verificar se a API está respondendo

### Deploy Manual com Docker Compose

```bash
# Construir e iniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Reiniciar
docker-compose restart
```

### Deploy Manual com Docker

```bash
# Construir a imagem
docker build -t fastify-api-teste .

# Executar o container
docker run -d \
  --name fastify-api-teste \
  --restart unless-stopped \
  -p 3000:3000 \
  fastify-api-teste

# Ver logs
docker logs -f fastify-api-teste

# Parar e remover
docker stop fastify-api-teste
docker rm fastify-api-teste
```

### Deploy no Umbrel OS

1. **Via SSH:**
   ```bash
   # Conecte-se ao seu Umbrel via SSH
   ssh usuario@seu-umbrel.local
   
   # Navegue até o diretório desejado (ex: ~/apps)
   cd ~/apps
   
   # Clone ou copie o projeto
   git clone <seu-repositorio> fastify-api
   cd fastify-api
   
   # Execute o deploy
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Via Interface Umbrel (se suportar Docker Compose):**
   - Copie os arquivos do projeto para o Umbrel
   - Use a interface para executar Docker Compose ou execute via SSH

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` se precisar configurar variáveis:

```bash
NODE_ENV=production
PORT=3000
```

E atualize o `docker-compose.yml` para incluir:
```yaml
env_file:
  - .env
```

### Verificar Status

```bash
# Verificar se o container está rodando
docker ps | grep fastify-api-teste

# Verificar health check
curl http://localhost:3000/api/sistema/health

# Ver logs em tempo real
docker-compose logs -f api
```

### Atualizar a Aplicação

```bash
# Parar containers
docker-compose down

# Atualizar código (git pull, etc)
git pull  # ou copie novos arquivos

# Reconstruir e reiniciar
docker-compose up -d --build
```

## 📄 Licença

MIT

