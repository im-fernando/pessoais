import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
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

// Registrar rotas
await fastify.register(tarefasRoutes);
await fastify.register(utilidadesRoutes);
await fastify.register(sistemaRoutes);

// Rota raiz
fastify.get('/', async (request, reply) => {
  return {
    message: '🚀 API Fastify funcionando!',
    version: '1.0.0',
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

