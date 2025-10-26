/**
 * Protocolo de Chat de Agentes para ASI One
 * Basado en la especificación de ASI One Agent Chat Protocol
 * https://docs.asi1.ai/documentation/tutorials/agent-chat-protocol
 */
import { z } from 'zod';
/**
 * Mensaje según el protocolo de chat de agentes
 */
export declare const AgentChatMessageSchema: z.ZodObject<{
    role: z.ZodEnum<["user", "assistant", "agent"]>;
    content: z.ZodString;
    agent_id: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    timestamp: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    role: "user" | "assistant" | "agent";
    content: string;
    agent_id?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    timestamp?: number | undefined;
}, {
    role: "user" | "assistant" | "agent";
    content: string;
    agent_id?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    timestamp?: number | undefined;
}>;
export type AgentChatMessage = z.infer<typeof AgentChatMessageSchema>;
/**
 * Respuesta del agente compatible con ASI One
 */
export declare const AgentResponseSchema: z.ZodObject<{
    message: z.ZodString;
    agent_id: z.ZodString;
    status: z.ZodEnum<["success", "error", "pending"]>;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reasoning: z.ZodOptional<z.ZodString>;
    suggestions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "success" | "error" | "pending";
    message: string;
    agent_id: string;
    data?: Record<string, unknown> | undefined;
    reasoning?: string | undefined;
    suggestions?: string[] | undefined;
}, {
    status: "success" | "error" | "pending";
    message: string;
    agent_id: string;
    data?: Record<string, unknown> | undefined;
    reasoning?: string | undefined;
    suggestions?: string[] | undefined;
}>;
export type AgentResponse = z.infer<typeof AgentResponseSchema>;
/**
 * Solicitud al agente desde ASI One
 */
export declare const AgentRequestSchema: z.ZodObject<{
    query: z.ZodString;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    user_id: z.ZodOptional<z.ZodString>;
    conversation_id: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    query: string;
    metadata?: Record<string, unknown> | undefined;
    context?: Record<string, unknown> | undefined;
    user_id?: string | undefined;
    conversation_id?: string | undefined;
}, {
    query: string;
    metadata?: Record<string, unknown> | undefined;
    context?: Record<string, unknown> | undefined;
    user_id?: string | undefined;
    conversation_id?: string | undefined;
}>;
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
export declare class AgentChatProtocol {
    /**
     * Valida un mensaje según el protocolo
     */
    static validateMessage(message: unknown): AgentChatMessage;
    /**
     * Valida una solicitud de agente
     */
    static validateRequest(request: unknown): AgentRequest;
    /**
     * Crea una respuesta estándar del agente
     */
    static createResponse(agentId: string, message: string, status?: 'success' | 'error' | 'pending', data?: Record<string, unknown>, reasoning?: string, suggestions?: string[]): AgentResponse;
    /**
     * Formatea mensaje para ASI One
     */
    static formatMessageForASIOne(role: 'user' | 'assistant' | 'agent', content: string, agentId?: string, metadata?: Record<string, unknown>): AgentChatMessage;
}
//# sourceMappingURL=agent-chat-protocol.d.ts.map