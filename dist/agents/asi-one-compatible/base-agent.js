/**
 * Agente base compatible con ASI One
 * Implementa el protocolo de chat de agentes
 */
import { AgentChatProtocol } from '../../protocols/agent-chat-protocol.js';
/**
 * Agente base compatible con ASI One
 */
export class ASIOneCompatibleAgent {
    agentId;
    capabilities;
    constructor(agentId, capabilities) {
        this.agentId = agentId;
        this.capabilities = capabilities;
    }
    /**
     * Handler principal que valida y procesa solicitudes
     */
    async handleRequest(request) {
        try {
            // Validar request según protocolo
            const validatedRequest = AgentChatProtocol.validateRequest(request);
            // Procesar con el agente específico
            const response = await this.processRequest(validatedRequest);
            return response;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return AgentChatProtocol.createResponse(this.agentId, `Error processing request: ${errorMessage}`, 'error');
        }
    }
    /**
     * Obtiene metadata del agente para ASI One
     */
    getMetadata() {
        return {
            agent_id: this.agentId,
            name: this.capabilities.name,
            description: this.capabilities.description,
            capabilities: this.capabilities.capabilities,
            supported_tasks: this.capabilities.supportedTasks,
        };
    }
}
//# sourceMappingURL=base-agent.js.map