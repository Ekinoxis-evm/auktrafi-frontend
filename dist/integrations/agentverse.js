/**
 * Integración con Agentverse
 * SDK para gestionar agentes en Agentverse y hacerlos compatibles con ASI One
 */
import axios from 'axios';
/**
 * Cliente para interactuar con Agentverse
 */
export class AgentverseClient {
    config;
    client;
    constructor(config) {
        this.config = config;
        this.client = axios.create({
            baseURL: config.endpoint,
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }
    /**
     * Registra un agente en Agentverse
     */
    async registerAgent(metadata) {
        try {
            const response = await this.client.post('/agents/register', {
                ...metadata,
                asi_one_compatible: true, // Marcar como compatible con ASI One
            });
            return {
                agentId: response.data.agent_id,
                status: response.data.status,
            };
        }
        catch (error) {
            console.error('Error registering agent:', error);
            throw error;
        }
    }
    /**
     * Actualiza metadata del agente
     */
    async updateAgentMetadata(agentId, metadata) {
        try {
            await this.client.put(`/agents/${agentId}/metadata`, metadata);
        }
        catch (error) {
            console.error('Error updating agent metadata:', error);
            throw error;
        }
    }
    /**
     * Obtiene información de un agente
     */
    async getAgentInfo(agentId) {
        try {
            const response = await this.client.get(`/agents/${agentId}`);
            return response.data;
        }
        catch (error) {
            console.error('Error getting agent info:', error);
            throw error;
        }
    }
    /**
     * Reporta métricas del agente (para ranking en Agentverse)
     */
    async reportMetrics(agentId, metrics) {
        try {
            await this.client.post(`/agents/${agentId}/metrics`, metrics);
        }
        catch (error) {
            console.error('Error reporting metrics:', error);
            // No lanzar error, solo loggear
        }
    }
    /**
     * Publica agente en el marketplace de Agentverse
     */
    async publishToMarketplace(agentId, listing) {
        try {
            await this.client.post(`/agents/${agentId}/marketplace`, listing);
        }
        catch (error) {
            console.error('Error publishing to marketplace:', error);
            throw error;
        }
    }
}
/**
 * Servidor HTTP simple para agentes compatibles con ASI One
 * Los agentes deben exponer endpoints HTTP para recibir solicitudes
 */
export class AgentServer {
    port;
    agentId;
    agentHandler;
    constructor(port, agentId, handler) {
        this.port = port;
        this.agentId = agentId;
        this.agentHandler = handler;
    }
    /**
     * Inicia el servidor HTTP del agente
     * En producción, usar Express o similar
     */
    async start() {
        console.log(`Agent server started for ${this.agentId} on port ${this.port}`);
        console.log(`Endpoint: http://localhost:${this.port}/chat`);
        console.log(`Health check: http://localhost:${this.port}/health`);
        // Nota: En implementación real, usar Express o framework HTTP
        // Por ahora, esto es un placeholder
    }
    /**
     * Maneja solicitud de chat (endpoint /chat)
     */
    async handleChatRequest(request) {
        return await this.agentHandler(request);
    }
    /**
     * Health check endpoint
     */
    async healthCheck() {
        return {
            status: 'healthy',
            agent_id: this.agentId,
        };
    }
}
//# sourceMappingURL=agentverse.js.map