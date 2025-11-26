# 🚀 Guia Rápido de Deploy

## Deploy no Umbrel OS

### Opção 1: Script Automatizado (Mais Fácil)

```bash
# 1. Conecte-se ao seu Umbrel via SSH
ssh usuario@seu-umbrel.local

# 2. Navegue até o diretório desejado
cd ~/apps  # ou qualquer outro diretório

# 3. Clone ou copie o projeto
git clone <seu-repositorio> fastify-api
cd fastify-api

# 4. Execute o script de deploy
chmod +x deploy.sh
./deploy.sh
```

Pronto! A API estará rodando em `http://seu-umbrel.local:3000`

### Opção 2: Docker Compose Manual

```bash
# No servidor Umbrel, após copiar os arquivos:
docker-compose up -d --build
```

### Opção 3: Docker Puro

```bash
# Construir
docker build -t fastify-api-teste .

# Executar
docker run -d \
  --name fastify-api-teste \
  --restart unless-stopped \
  -p 3000:3000 \
  fastify-api-teste
```

## Comandos Úteis

### Verificar Status
```bash
docker ps | grep fastify-api-teste
curl http://localhost:3000/api/sistema/health
```

### Ver Logs
```bash
docker-compose logs -f api
# ou
docker logs -f fastify-api-teste
```

### Parar/Iniciar
```bash
docker-compose stop
docker-compose start
# ou
docker stop fastify-api-teste
docker start fastify-api-teste
```

### Atualizar
```bash
# Parar
docker-compose down

# Atualizar código
git pull  # ou copie novos arquivos

# Reconstruir e iniciar
docker-compose up -d --build
```

### Remover Tudo
```bash
docker-compose down -v
docker rmi fastify-api-teste
```

## Acessar a API

Após o deploy, a API estará disponível em:

- **API Principal**: `http://seu-umbrel.local:3000`
- **Swagger UI**: `http://seu-umbrel.local:3000/documentation`
- **Scalar UI**: `http://seu-umbrel.local:3000/api-reference`
- **Health Check**: `http://seu-umbrel.local:3000/api/sistema/health`

## Troubleshooting

### Porta 3000 já em uso
Edite o `docker-compose.yml` e altere a porta:
```yaml
ports:
  - "3001:3000"  # Use 3001 externamente
```

### Container não inicia
```bash
# Ver logs detalhados
docker-compose logs api

# Verificar se a imagem foi construída
docker images | grep fastify-api-teste
```

### Reconstruir do zero
```bash
docker-compose down -v
docker rmi fastify-api-teste
docker-compose build --no-cache
docker-compose up -d
```

