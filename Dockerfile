# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json (se existir) para instalar apenas dependências de produção
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm install --omit=dev --no-package-lock && npm cache clean --force

# Copiar código compilado do builder
COPY --from=builder /app/dist ./dist

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Mudar ownership dos arquivos
RUN chown -R nodejs:nodejs /app

USER nodejs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/sistema/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]

