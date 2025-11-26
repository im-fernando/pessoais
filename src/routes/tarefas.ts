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
  _options: FastifyPluginOptions
): Promise<void> {
  // Listar todas as tarefas
  fastify.get<{ Querystring: TarefasQuery }>('/api/tarefas', {
    schema: {
      description: 'Lista todas as tarefas com filtros opcionais por status e prioridade',
      tags: ['tarefas'],
      querystring: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['pendente', 'em_andamento', 'concluida'],
            description: 'Filtrar por status da tarefa'
          },
          prioridade: {
            type: 'string',
            enum: ['baixa', 'media', 'alta'],
            description: 'Filtrar por prioridade da tarefa'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            total: { type: 'number', description: 'Total de tarefas encontradas' },
            tarefas: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  titulo: { type: 'string' },
                  descricao: { type: 'string' },
                  prioridade: { type: 'string', enum: ['baixa', 'media', 'alta'] },
                  status: { type: 'string', enum: ['pendente', 'em_andamento', 'concluida'] },
                  criadaEm: { type: 'string', format: 'date-time' },
                  atualizadaEm: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        }
      }
    }
  }, async (request) => {
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
  fastify.get<{ Params: { id: string } }>('/api/tarefas/:id', {
    schema: {
      description: 'Busca uma tarefa específica pelo ID',
      tags: ['tarefas'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID da tarefa' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            titulo: { type: 'string' },
            descricao: { type: 'string' },
            prioridade: { type: 'string', enum: ['baixa', 'media', 'alta'] },
            status: { type: 'string', enum: ['pendente', 'em_andamento', 'concluida'] },
            criadaEm: { type: 'string', format: 'date-time' },
            atualizadaEm: { type: 'string', format: 'date-time' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
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
      description: 'Cria uma nova tarefa',
      tags: ['tarefas'],
      body: {
        type: 'object',
        required: ['titulo'],
        properties: {
          titulo: { 
            type: 'string', 
            minLength: 1,
            description: 'Título da tarefa'
          },
          descricao: { 
            type: 'string',
            description: 'Descrição detalhada da tarefa'
          },
          prioridade: { 
            type: 'string', 
            enum: ['baixa', 'media', 'alta'],
            default: 'media',
            description: 'Prioridade da tarefa'
          },
          status: { 
            type: 'string', 
            enum: ['pendente', 'em_andamento', 'concluida'],
            default: 'pendente',
            description: 'Status atual da tarefa'
          }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            titulo: { type: 'string' },
            descricao: { type: 'string' },
            prioridade: { type: 'string', enum: ['baixa', 'media', 'alta'] },
            status: { type: 'string', enum: ['pendente', 'em_andamento', 'concluida'] },
            criadaEm: { type: 'string', format: 'date-time' },
            atualizadaEm: { type: 'string', format: 'date-time' }
          }
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
      description: 'Atualiza uma tarefa existente',
      tags: ['tarefas'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID da tarefa' }
        }
      },
      body: {
        type: 'object',
        properties: {
          titulo: { 
            type: 'string', 
            minLength: 1,
            description: 'Título da tarefa'
          },
          descricao: { 
            type: 'string',
            description: 'Descrição detalhada da tarefa'
          },
          prioridade: { 
            type: 'string', 
            enum: ['baixa', 'media', 'alta'],
            description: 'Prioridade da tarefa'
          },
          status: { 
            type: 'string', 
            enum: ['pendente', 'em_andamento', 'concluida'],
            description: 'Status atual da tarefa'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            titulo: { type: 'string' },
            descricao: { type: 'string' },
            prioridade: { type: 'string', enum: ['baixa', 'media', 'alta'] },
            status: { type: 'string', enum: ['pendente', 'em_andamento', 'concluida'] },
            criadaEm: { type: 'string', format: 'date-time' },
            atualizadaEm: { type: 'string', format: 'date-time' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
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
  fastify.delete<{ Params: { id: string } }>('/api/tarefas/:id', {
    schema: {
      description: 'Remove uma tarefa pelo ID',
      tags: ['tarefas'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID da tarefa' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            tarefa: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                titulo: { type: 'string' },
                descricao: { type: 'string' },
                prioridade: { type: 'string', enum: ['baixa', 'media', 'alta'] },
                status: { type: 'string', enum: ['pendente', 'em_andamento', 'concluida'] },
                criadaEm: { type: 'string', format: 'date-time' },
                atualizadaEm: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
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
    
    const tarefaRemovida = tarefas.splice(tarefaIndex, 1)[0];
    
    return {
      message: 'Tarefa removida com sucesso',
      tarefa: tarefaRemovida
    };
  });

  // Estatísticas das tarefas
  fastify.get('/api/tarefas/stats', {
    schema: {
      description: 'Retorna estatísticas sobre as tarefas',
      tags: ['tarefas'],
      response: {
        200: {
          type: 'object',
          properties: {
            total: { type: 'number', description: 'Total de tarefas' },
            porStatus: {
              type: 'object',
              properties: {
                pendente: { type: 'number' },
                em_andamento: { type: 'number' },
                concluida: { type: 'number' }
              }
            },
            porPrioridade: {
              type: 'object',
              properties: {
                baixa: { type: 'number' },
                media: { type: 'number' },
                alta: { type: 'number' }
              }
            }
          }
        }
      }
    }
  }, async () => {
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

