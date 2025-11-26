import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import os from 'os';
import process from 'process';

const formatarBytes = (bytes: number): string => {
  const unidades = ['B', 'KB', 'MB', 'GB', 'TB'];
  let tamanho = bytes;
  let unidade = 0;
  
  while (tamanho >= 1024 && unidade < unidades.length - 1) {
    tamanho /= 1024;
    unidade++;
  }
  
  return `${tamanho.toFixed(2)} ${unidades[unidade]}`;
};

export async function sistemaRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
): Promise<void> {
  // Informações do sistema
  fastify.get('/api/sistema/info', async () => {
    return {
      plataforma: process.platform,
      arquitetura: process.arch,
      nodeVersion: process.version,
      uptime: {
        processo: Math.floor(process.uptime()),
        sistema: Math.floor(os.uptime())
      },
      memoria: {
        total: os.totalmem(),
        livre: os.freemem(),
        usada: os.totalmem() - os.freemem(),
        percentualUsado: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2) + '%'
      },
      cpus: {
        quantidade: os.cpus().length,
        modelo: os.cpus()[0]?.model || 'N/A'
      },
      hostname: os.hostname(),
      homeDir: os.homedir(),
      tempDir: os.tmpdir()
    };
  });

  // Informações de memória detalhadas
  fastify.get('/api/sistema/memoria', async () => {
    const total = os.totalmem();
    const livre = os.freemem();
    const usada = total - livre;
    
    return {
      total: {
        bytes: total,
        formatado: formatarBytes(total)
      },
      livre: {
        bytes: livre,
        formatado: formatarBytes(livre)
      },
      usada: {
        bytes: usada,
        formatado: formatarBytes(usada)
      },
      percentualUsado: ((usada / total) * 100).toFixed(2) + '%',
      percentualLivre: ((livre / total) * 100).toFixed(2) + '%'
    };
  });

  // Informações das CPUs
  fastify.get('/api/sistema/cpus', async () => {
    const cpus = os.cpus();
    
    return {
      quantidade: cpus.length,
      detalhes: cpus.map((cpu, index) => ({
        indice: index,
        modelo: cpu.model.trim(),
        velocidade: cpu.speed + ' MHz',
        tempos: {
          usuario: cpu.times.user,
          sistema: cpu.times.sys,
          idle: cpu.times.idle,
          irq: cpu.times.irq
        }
      }))
    };
  });

  // Informações de rede
  fastify.get('/api/sistema/rede', async () => {
    const interfaces = os.networkInterfaces();
    const interfacesFormatadas: Record<string, Array<{
      endereco: string;
      netmask: string;
      familia: string;
      mac: string;
      interno: boolean;
    }>> = {};
    
    if (interfaces) {
      for (const [nome, addrs] of Object.entries(interfaces)) {
        if (addrs) {
          interfacesFormatadas[nome] = addrs.map(addr => ({
            endereco: addr.address,
            netmask: addr.netmask,
            familia: addr.family,
            mac: addr.mac,
            interno: addr.internal
          }));
        }
      }
    }
    
    return {
      interfaces: interfacesFormatadas,
      hostname: os.hostname()
    };
  });

  // Health check
  fastify.get('/api/sistema/health', async (_request, reply) => {
    const memoriaLivre = os.freemem();
    const memoriaTotal = os.totalmem();
    const percentualMemoriaLivre = (memoriaLivre / memoriaTotal) * 100;
    
    const status: {
      status: string;
      timestamp: string;
      uptime: number;
      memoria: {
        livre: string;
        status: string;
      };
    } = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoria: {
        livre: percentualMemoriaLivre.toFixed(2) + '%',
        status: percentualMemoriaLivre > 10 ? 'ok' : 'warning'
      }
    };
    
    if (percentualMemoriaLivre < 10) {
      status.status = 'warning';
      reply.code(503);
    }
    
    return status;
  });

  // Informações do processo Node.js
  fastify.get('/api/sistema/processo', async () => {
    const usoMemoria = process.memoryUsage();
    
    return {
      pid: process.pid,
      versao: process.version,
      plataforma: process.platform,
      arquitetura: process.arch,
      uptime: Math.floor(process.uptime()),
      memoria: {
        rss: {
          bytes: usoMemoria.rss,
          formatado: formatarBytes(usoMemoria.rss)
        },
        heapTotal: {
          bytes: usoMemoria.heapTotal,
          formatado: formatarBytes(usoMemoria.heapTotal)
        },
        heapUsed: {
          bytes: usoMemoria.heapUsed,
          formatado: formatarBytes(usoMemoria.heapUsed)
        },
        external: {
          bytes: usoMemoria.external,
          formatado: formatarBytes(usoMemoria.external)
        }
      },
      variaveisAmbiente: Object.keys(process.env).length
    };
  });
}

