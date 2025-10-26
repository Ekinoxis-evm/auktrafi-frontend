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
/**
 * Implementación del protocolo de chat para agentes ASI One
 */
export class AgentChatProtocol {
    /**
     * Valida un mensaje según el protocolo
     */
    static validateMessage(message) {
        return AgentChatMessageSchema.parse(message);
    }
    /**
     * Valida una solicitud de agente
     */
    static validateRequest(request) {
        return AgentRequestSchema.parse(request);
    }
    /**
     * Crea una respuesta estándar del agente
     */
    static createResponse(agentId, message, status = 'success', data, reasoning, suggestions) {
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
    static formatMessageForASIOne(role, content, agentId, metadata) {
        return {
            role,
            content,
            agent_id: agentId,
            metadata,
            timestamp: Date.now(),
        };
    }
}
//# sourceMappingURL=agent-chat-protocol.js.map