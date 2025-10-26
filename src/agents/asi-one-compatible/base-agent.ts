/**
 * Agente base compatible con ASI One
 * Implementa el protocolo de chat de agentes
 */

import { AgentRequest, AgentResponse, AgentChatProtocol } from '../../protocols/agent-chat-protocol.js';

export interface AuktrafiAgentCapabilities {
  name: string;
  description: string;
  capabilities: string[];
  supportedTasks: string[];
}

/**
 * Agente base compatible con ASI One
 */
export abstract class ASIOneCompatibleAgent {
  protected agentId: string;
  protected capabilities: AuktrafiAgentCapabilities;

  constructor(
    agentId: string,
    capabilities: AuktrafiAgentCapabilities
  ) {
    this.agentId = agentId;
    this.capabilities = capabilities;
  }

  /**
   * Procesa una solicitud según el protocolo de chat
   * Este método debe ser implementado por cada agente específico
   */
  abstract processRequest(request: AgentRequest): Promise<AgentResponse>;

  /**
   * Handler principal que valida y procesa solicitudes
   */
  async handleRequest(request: unknown): Promise<AgentResponse> {
    try {
      // Validar request según protocolo
      const validatedRequest = AgentChatProtocol.validateRequest(request);
      
      // Procesar con el agente específico
      const response = await this.processRequest(validatedRequest);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return AgentChatProtocol.createResponse(
        this.agentId,
        `Error processing request: ${errorMessage}`,
        'error'
      );
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
