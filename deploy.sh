#!/bin/bash

# Script de deploy automatizado para Umbrel OS
# Este script instala dependências, constrói e inicia a aplicação usando Docker

set -e  # Sair em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando deploy da API Fastify...${NC}"

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado. Por favor, instale o Docker primeiro.${NC}"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro.${NC}"
    exit 1
fi

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -f "Dockerfile" ]; then
    echo -e "${RED}❌ Arquivos necessários não encontrados. Certifique-se de estar no diretório do projeto.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Parando containers existentes...${NC}"
docker-compose down 2>/dev/null || docker compose down 2>/dev/null || true

echo -e "${YELLOW}🔨 Construindo imagem Docker...${NC}"
if docker compose version &> /dev/null; then
    docker compose build --no-cache
else
    docker-compose build --no-cache
fi

echo -e "${YELLOW}🚀 Iniciando containers...${NC}"
if docker compose version &> /dev/null; then
    docker compose up -d
else
    docker-compose up -d
fi

# Aguardar alguns segundos para o container iniciar
echo -e "${YELLOW}⏳ Aguardando API iniciar...${NC}"
sleep 5

# Verificar se a API está respondendo
if curl -f http://localhost:3000/api/sistema/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
    echo -e "${GREEN}📚 API disponível em:${NC}"
    echo -e "   - API: http://localhost:3000"
    echo -e "   - Swagger UI: http://localhost:3000/documentation"
    echo -e "   - Scalar UI: http://localhost:3000/api-reference"
    echo -e "   - Health Check: http://localhost:3000/api/sistema/health"
    echo ""
    echo -e "${GREEN}📊 Status do container:${NC}"
    if docker compose version &> /dev/null; then
        docker compose ps
    else
        docker-compose ps
    fi
else
    echo -e "${YELLOW}⚠️  Container iniciado, mas API ainda não está respondendo. Verifique os logs:${NC}"
    if docker compose version &> /dev/null; then
        docker compose logs
    else
        docker-compose logs
    fi
fi

