import { FastifyInstance, FastifyPluginOptions } from 'fastify';

// Tipos
type Prioridade = 'baixa' | 'media' | 'alta';
type Status = 'pendente' | 'em_andamento' | 'concluida';

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  status: Status;
  criadaEm: string;
  atualizadaEm: string;
}

interface CriarTarefaBody {
  titulo: string;
  descricao?: string;
  prioridade?: Prioridade;
  status?: Status;
}

interface AtualizarTarefaBody {
  titulo?: string;
  descricao?: string;
  prioridade?: Prioridade;
  status?: Status;
}

interface TarefasQuery {
  status?: Status;
  prioridade?: Prioridade;
}

// Armazenamento em memória (simulado)
let tarefas: Tarefa[] = [];
let proximoId = 1;

export async function tarefasRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  // Listar todas as tarefas
  fastify.get<{ Querystring: TarefasQuery }>('/api/tarefas', async (request, reply) => {
    const { status, prioridade } = request.query;
    
    let tarefasFiltradas = [...tarefas];
    
    if (status) {
      tarefasFiltradas = tarefasFiltradas.filter(t => t.status === status);
    }
    
    if (prioridade) {
      tarefasFiltradas = tarefasFiltradas.filter(t => t.prioridade === prioridade);
    }
    
    return {
      total: tarefasFiltradas.length,
      tarefas: tarefasFiltradas
    };
  });

  // Buscar tarefa por ID
  fastify.get<{ Params: { id: string } }>('/api/tarefas/:id', async (request, reply) => {
    const { id } = request.params;
    const tarefa = tarefas.find(t => t.id === parseInt(id));
    
    if (!tarefa) {
      reply.code(404);
      return { error: 'Tarefa não encontrada' };
    }
    
    return tarefa;
  });

  // Criar nova tarefa
  fastify.post<{ Body: CriarTarefaBody }>('/api/tarefas', {
    schema: {
      body: {
        type: 'object',
        required: ['titulo'],
        properties: {
          titulo: { type: 'string', minLength: 1 },
          descricao: { type: 'string' },
          prioridade: { type: 'string', enum: ['baixa', 'media', 'alta'] },
          status: { type: 'string', enum: ['pendente', 'em_andamento', 'concluida'] }
        }
      }
    }
  }, async (request, reply) => {
    const { titulo, descricao = '', prioridade = 'media', status = 'pendente' } = request.body;
    
    const novaTarefa: Tarefa = {
      id: proximoId++,
      titulo,
      descricao,
      prioridade,
      status,
      criadaEm: new Date().toISOString(),
      atualizadaEm: new Date().toISOString()
    };
    
    tarefas.push(novaTarefa);
    
    reply.code(201);
    return novaTarefa;
  });

  // Atualizar tarefa
  fastify.put<{ Params: { id: string }; Body: AtualizarTarefaBody }>('/api/tarefas/:id', {
    schema: {
      body: {
        type: 'object',
        properties: {
          titulo: { type: 'string', minLength: 1 },
          descricao: { type: 'string' },
          prioridade: { type: 'string', enum: ['baixa', 'media', 'alta'] },
          status: { type: 'string', enum: ['pendente', 'em_andamento', 'concluida'] }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const tarefaIndex = tarefas.findIndex(t => t.id === parseInt(id));
    
    if (tarefaIndex === -1) {
      reply.code(404);
      return { error: 'Tarefa não encontrada' };
    }
    
    const tarefaAtual = tarefas[tarefaIndex];
    const tarefaAtualizada: Tarefa = {
      ...tarefaAtual,
      ...request.body,
      id: tarefaAtual.id,
      criadaEm: tarefaAtual.criadaEm,
      atualizadaEm: new Date().toISOString()
    };
    
    tarefas[tarefaIndex] = tarefaAtualizada;
    
    return tarefaAtualizada;
  });

  // Deletar tarefa
  fastify.delete<{ Params: { id: string } }>('/api/tarefas/:id', async (request, reply) => {
    const { id } = request.params;
    const tarefaIndex = tarefas.findIndex(t => t.id === parseInt(id));
    
    if (tarefaIndex === -1) {
      reply.code(404);
      return { error: 'Tarefa não encontrada' };
    }
    
    const tarefaRemovida = tarefas.splice(tarefaIndex, 1)[0];
    
    return {
      message: 'Tarefa removida com sucesso',
      tarefa: tarefaRemovida
    };
  });

  // Estatísticas das tarefas
  fastify.get('/api/tarefas/stats', async (request, reply) => {
    const stats = {
      total: tarefas.length,
      porStatus: {
        pendente: tarefas.filter(t => t.status === 'pendente').length,
        em_andamento: tarefas.filter(t => t.status === 'em_andamento').length,
        concluida: tarefas.filter(t => t.status === 'concluida').length
      },
      porPrioridade: {
        baixa: tarefas.filter(t => t.prioridade === 'baixa').length,
        media: tarefas.filter(t => t.prioridade === 'media').length,
        alta: tarefas.filter(t => t.prioridade === 'alta').length
      }
    };
    
    return stats;
  });
}

