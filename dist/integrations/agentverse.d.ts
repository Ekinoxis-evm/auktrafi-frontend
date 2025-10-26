/**
 * Integración con Agentverse
 * SDK para gestionar agentes en Agentverse y hacerlos compatibles con ASI One
 */
import { AgentMetadata, AgentResponse, AgentRequest } from '../protocols/agent-chat-protocol.js';
export interface AgentverseConfig {
    apiKey: string;
    endpoint: string;
    agentId?: string;
}
/**
 * Cliente para interactuar con Agentverse
 */
export declare class AgentverseClient {
    private config;
    private client;
    constructor(config: AgentverseConfig);
    /**
     * Registra un agente en Agentverse
     */
    registerAgent(metadata: AgentMetadata): Promise<{
        agentId: string;
        status: string;
    }>;
    /**
     * Actualiza metadata del agente
     */
    updateAgentMetadata(agentId: string, metadata: Partial<AgentMetadata>): Promise<void>;
    /**
     * Obtiene información de un agente
     */
    getAgentInfo(agentId: string): Promise<AgentMetadata & {
        status: string;
    }>;
    /**
     * Reporta métricas del agente (para ranking en Agentverse)
     */
    reportMetrics(agentId: string, metrics: {
        interactions: number;
        successRate: number;
        avgResponseTime: number;
    }): Promise<void>;
    /**
     * Publica agente en el marketplace de Agentverse
     */
    publishToMarketplace(agentId: string, listing: {
        title: string;
        description: string;
        category: string;
        tags: string[];
        price?: number;
    }): Promise<void>;
}
/**
 * Servidor HTTP simple para agentes compatibles con ASI One
 * Los agentes deben exponer endpoints HTTP para recibir solicitudes
 */
export declare class AgentServer {
    private port;
    private agentId;
    private agentHandler;
    constructor(port: number, agentId: string, handler: (request: AgentRequest) => Promise<AgentResponse>);
    /**
     * Inicia el servidor HTTP del agente
     * En producción, usar Express o similar
     */
    start(): Promise<void>;
    /**
     * Maneja solicitud de chat (endpoint /chat)
     */
    handleChatRequest(request: AgentRequest): Promise<AgentResponse>;
    /**
     * Health check endpoint
     */
    healthCheck(): Promise<{
        status: string;
        agent_id: string;
    }>;
}
//# sourceMappingURL=agentverse.d.ts.map