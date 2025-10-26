/**
 * Agente Informativo de Auktrafi
 * Proporciona información sobre la plataforma de reservas y subastas inmobiliarias
 */
import { ASIOneCompatibleAgent } from './asi-one-compatible/base-agent.js';
import { AgentRequest, AgentResponse } from '../protocols/agent-chat-protocol.js';
export declare class AuktrafiInfoAgent extends ASIOneCompatibleAgent {
    constructor();
    processRequest(request: AgentRequest): Promise<AgentResponse>;
    private handlePlatformInfo;
    private handleReservationInfo;
    private handleAuctionInfo;
    private handleFeatures;
    private handleFAQ;
    private handleHelp;
    private handleGeneralInfo;
    private parseIntent;
}
//# sourceMappingURL=info-agent.d.ts.map