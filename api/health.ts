/**
 * Health check endpoint para Vercel
 */

// @ts-nocheck
import { AuktrafiInfoAgent } from '../src/agents/info-agent.js';

const agent = new AuktrafiInfoAgent();

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).json({
    status: 'healthy',
    agent_id: agent.getMetadata().agent_id,
    name: agent.getMetadata().name,
  });
}
