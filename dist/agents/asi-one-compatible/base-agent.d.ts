/**
 * Agente base compatible con ASI One
 * Implementa el protocolo de chat de agentes
 */
import { AgentRequest, AgentResponse } from '../../protocols/agent-chat-protocol.js';
export interface AuktrafiAgentCapabilities {
    name: string;
    description: string;
    capabilities: string[];
    supportedTasks: string[];
}
/**
 * Agente base compatible con ASI One
 */
export declare abstract class ASIOneCompatibleAgent {
    protected agentId: string;
    protected capabilities: AuktrafiAgentCapabilities;
    constructor(agentId: string, capabilities: AuktrafiAgentCapabilities);
    /**
     * Procesa una solicitud según el protocolo de chat
     * Este método debe ser implementado por cada agente específico
     */
    abstract processRequest(request: AgentRequest): Promise<AgentResponse>;
    /**
     * Handler principal que valida y procesa solicitudes
     */
    handleRequest(request: unknown): Promise<AgentResponse>;
    /**
     * Obtiene metadata del agente para ASI One
     */
    getMetadata(): {
        agent_id: string;
        name: string;
        description: string;
        capabilities: string[];
        supported_tasks: string[];
    };
}
//# sourceMappingURL=base-agent.d.ts.map