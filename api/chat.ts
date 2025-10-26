/**
 * Endpoint para Vercel Serverless Functions
 * Agente informativo de Auktrafi - ASI One compatible
 */

import { AuktrafiInfoAgent } from '../src/agents/info-agent.js';
import { AgentChatProtocol } from '../src/protocols/agent-chat-protocol.js';

const agent = new AuktrafiInfoAgent();

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const request = AgentChatProtocol.validateRequest(req.body);
    const response = await agent.handleRequest(request);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Invalid request',
      agent_id: agent.getMetadata().agent_id,
      status: 'error',
    });
  }
}
