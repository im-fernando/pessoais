import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import crypto from 'crypto';

// Tipos
type AlgoritmoHash = 'md5' | 'sha1' | 'sha256' | 'sha512';
type FormatoConversao = 'base64' | 'hex' | 'uppercase' | 'lowercase' | 'reverse';

interface UuidQuery {
  quantidade?: string;
}

interface HashBody {
  texto: string;
  algoritmo?: AlgoritmoHash;
}

interface SenhaQuery {
  tamanho?: string;
  incluirNumeros?: string | boolean;
  incluirSimbolos?: string | boolean;
  incluirMaiusculas?: string | boolean;
  incluirMinusculas?: string | boolean;
}

interface ConverterBody {
  texto: string;
  formato: FormatoConversao;
}

interface AnalisarTextoBody {
  texto: string;
}

export async function utilidadesRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
): Promise<void> {
  // Gerar UUID v4
  fastify.get<{ Querystring: UuidQuery }>('/api/utilidades/uuid', async (request) => {
    const { quantidade = '1' } = request.query;
    const qtd = Math.min(Math.max(parseInt(quantidade) || 1, 1), 100);
    
    const uuids = Array.from({ length: qtd }, () => crypto.randomUUID());
    
    return {
      quantidade: qtd,
      uuids: qtd === 1 ? uuids[0] : uuids
    };
  });

  // Hash de texto
  fastify.post<{ Body: HashBody }>('/api/utilidades/hash', {
    schema: {
      body: {
        type: 'object',
        required: ['texto'],
        properties: {
          texto: { type: 'string' },
          algoritmo: { type: 'string', enum: ['md5', 'sha1', 'sha256', 'sha512'] }
        }
      }
    }
  }, async (request) => {
    const { texto, algoritmo = 'sha256' } = request.body;
    
    const hash = crypto.createHash(algoritmo).update(texto).digest('hex');
    
    return {
      texto,
      algoritmo,
      hash,
      tamanho: hash.length
    };
  });

  // Gerar senha aleatória
  fastify.get<{ Querystring: SenhaQuery }>('/api/utilidades/senha', async (request, reply) => {
    const { 
      tamanho = '16', 
      incluirNumeros = 'true', 
      incluirSimbolos = 'true',
      incluirMaiusculas = 'true',
      incluirMinusculas = 'true'
    } = request.query;
    
    const t = Math.min(Math.max(parseInt(tamanho) || 16, 8), 128);
    
    let caracteres = '';
    if (incluirMinusculas === 'true' || incluirMinusculas === true) {
      caracteres += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (incluirMaiusculas === 'true' || incluirMaiusculas === true) {
      caracteres += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (incluirNumeros === 'true' || incluirNumeros === true) {
      caracteres += '0123456789';
    }
    if (incluirSimbolos === 'true' || incluirSimbolos === true) {
      caracteres += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }
    
    if (caracteres === '') {
      reply.code(400);
      return { error: 'Pelo menos um tipo de caractere deve ser incluído' };
    }
    
    let senha = '';
    for (let i = 0; i < t; i++) {
      senha += caracteres.charAt(crypto.randomInt(0, caracteres.length));
    }
    
    return {
      senha,
      tamanho: senha.length,
      configuracao: {
        incluirNumeros,
        incluirSimbolos,
        incluirMaiusculas,
        incluirMinusculas
      }
    };
  });

  // Converter texto para diferentes formatos
  fastify.post<{ Body: ConverterBody }>('/api/utilidades/converter', {
    schema: {
      body: {
        type: 'object',
        required: ['texto', 'formato'],
        properties: {
          texto: { type: 'string' },
          formato: { type: 'string', enum: ['base64', 'hex', 'uppercase', 'lowercase', 'reverse'] }
        }
      }
    }
  }, async (request, reply) => {
    const { texto, formato } = request.body;
    
    let resultado: string;
    
    switch (formato) {
      case 'base64':
        resultado = Buffer.from(texto).toString('base64');
        break;
      case 'hex':
        resultado = Buffer.from(texto).toString('hex');
        break;
      case 'uppercase':
        resultado = texto.toUpperCase();
        break;
      case 'lowercase':
        resultado = texto.toLowerCase();
        break;
      case 'reverse':
        resultado = texto.split('').reverse().join('');
        break;
      default:
        reply.code(400);
        return { error: 'Formato inválido' };
    }
    
    return {
      original: texto,
      formato,
      resultado
    };
  });

  // Informações sobre um texto
  fastify.post<{ Body: AnalisarTextoBody }>('/api/utilidades/analisar-texto', {
    schema: {
      body: {
        type: 'object',
        required: ['texto'],
        properties: {
          texto: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const { texto } = request.body;
    
    const analise = {
      tamanho: texto.length,
      palavras: texto.trim() === '' ? 0 : texto.trim().split(/\s+/).length,
      caracteres: texto.length,
      caracteresSemEspacos: texto.replace(/\s/g, '').length,
      linhas: texto.split('\n').length,
      maiusculas: (texto.match(/[A-Z]/g) || []).length,
      minusculas: (texto.match(/[a-z]/g) || []).length,
      numeros: (texto.match(/[0-9]/g) || []).length,
      simbolos: (texto.match(/[^a-zA-Z0-9\s]/g) || []).length,
      vazio: texto.trim().length === 0
    };
    
    return analise;
  });
}

