/**
 * Protocolo de Chat de Agentes para ASI One
 * Basado en la especificación de ASI One Agent Chat Protocol
 * https://docs.asi1.ai/documentation/tutorials/agent-chat-protocol
 */

import { z } from 'zod';

/**
 * Mensaje según el protocolo de chat de agentes
 */
export const AgentChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'agent']),
  content: z.string(),
  agent_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  timestamp: z.number().optional(),
});

export type AgentChatMessage = z.infer<typeof AgentChatMessageSchema>;

/**
 * Respuesta del agente compatible con ASI One
 */
export const AgentResponseSchema = z.object({
  message: z.string(),
  agent_id: z.string(),
  status: z.enum(['success', 'error', 'pending']),
  data: z.record(z.unknown()).optional(),
  reasoning: z.string().optional(),
  suggestions: z.array(z.string()).optional(),
});

export type AgentResponse = z.infer<typeof AgentResponseSchema>;

/**
 * Solicitud al agente desde ASI One
 */
export const AgentRequestSchema = z.object({
  query: z.string(),
  context: z.record(z.unknown()).optional(),
  user_id: z.string().optional(),
  conversation_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type AgentRequest = z.infer<typeof AgentRequestSchema>;

/**
 * Metadata del agente para registro en Agentverse
 */
export interface AgentMetadata {
  name: string;
  description: string;
  version: string;
  capabilities: string[];
  endpoints: {
    chat: string;
    health: string;
  };
  tags: string[];
  category: string;
  author: string;
}

/**
 * Implementación del protocolo de chat para agentes ASI One
 */
export class AgentChatProtocol {
  /**
   * Valida un mensaje según el protocolo
   */
  static validateMessage(message: unknown): AgentChatMessage {
    return AgentChatMessageSchema.parse(message);
  }

  /**
   * Valida una solicitud de agente
   */
  static validateRequest(request: unknown): AgentRequest {
    return AgentRequestSchema.parse(request);
  }

  /**
   * Crea una respuesta estándar del agente
   */
  static createResponse(
    agentId: string,
    message: string,
    status: 'success' | 'error' | 'pending' = 'success',
    data?: Record<string, unknown>,
    reasoning?: string,
    suggestions?: string[]
  ): AgentResponse {
    return {
      message,
      agent_id: agentId,
      status,
      data,
      reasoning,
      suggestions,
    };
  }

  /**
   * Formatea mensaje para ASI One
   */
  static formatMessageForASIOne(
    role: 'user' | 'assistant' | 'agent',
    content: string,
    agentId?: string,
    metadata?: Record<string, unknown>
  ): AgentChatMessage {
    return {
      role,
      content,
      agent_id: agentId,
      metadata,
      timestamp: Date.now(),
    };
  }
}


