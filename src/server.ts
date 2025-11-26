import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import scalarFastifyPlugin from '@scalar/fastify-api-reference';
import { tarefasRoutes } from './routes/tarefas.js';
import { utilidadesRoutes } from './routes/utilidades.js';
import { sistemaRoutes } from './routes/sistema.js';

const fastify: FastifyInstance = Fastify({
  logger: true
});

// Registrar CORS
await fastify.register(cors, {
  origin: true
});

// Registrar Swagger/OpenAPI
await fastify.register(swagger, {
  openapi: {
    openapi: '3.1.0',
    info: {
      title: 'API Fastify - Teste',
      description: 'API simples em Fastify com rotas interessantes para testes e desenvolvimento',
      version: '1.0.0',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    tags: [
      { name: 'tarefas', description: 'Operações relacionadas a tarefas' },
      { name: 'utilidades', description: 'Ferramentas e utilitários' },
      { name: 'sistema', description: 'Informações do sistema' }
    ]
  }
});

// Registrar Swagger UI
await fastify.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  staticCSP: true,
  transformStaticCSP: (header) => header
});

// Registrar Scalar UI
await fastify.register(scalarFastifyPlugin, {
  routePrefix: '/api-reference',
  configuration: {
    theme: 'default',
    spec: {
      url: '/documentation/json'
    }
  }
});

// Registrar rotas
await fastify.register(tarefasRoutes);
await fastify.register(utilidadesRoutes);
await fastify.register(sistemaRoutes);

// Rota raiz
fastify.get('/', async () => {
  return {
    message: '🚀 API Fastify funcionando!',
    version: '1.0.0',
    documentacao: {
      swagger: '/documentation',
      scalar: '/api-reference',
      openapi: '/documentation/json'
    },
    rotas: {
      tarefas: '/api/tarefas',
      utilidades: '/api/utilidades',
      sistema: '/api/sistema'
    }
  };
});

// Iniciar servidor
const start = async (): Promise<void> => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Servidor rodando em http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

