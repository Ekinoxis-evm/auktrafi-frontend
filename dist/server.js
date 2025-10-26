/**
 * Servidor HTTP para el agente informativo de Auktrafi
 * Compatible con Vercel y Agentverse
 */
import express from 'express';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { AuktrafiInfoAgent } from './agents/info-agent.js';
import { AgentChatProtocol } from './protocols/agent-chat-protocol.js';
config();
const app = express();
app.use(express.json());
// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Servir archivos estáticos
app.use(express.static(join(__dirname, '../public')));
// Inicializar agente
const infoAgent = new AuktrafiInfoAgent();
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        agent_id: infoAgent.getMetadata().agent_id,
        name: infoAgent.getMetadata().name,
    });
});
// Chat endpoint para ASI One / Agentverse
app.post('/chat', async (req, res) => {
    try {
        const request = AgentChatProtocol.validateRequest(req.body);
        const response = await infoAgent.handleRequest(request);
        res.json(response);
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Invalid request',
            agent_id: infoAgent.getMetadata().agent_id,
            status: 'error',
        });
    }
});
// Info endpoint
app.get('/api', (req, res) => {
    res.json({
        agent: infoAgent.getMetadata(),
        endpoints: {
            health: '/health',
            chat: '/chat',
        },
        usage: {
            method: 'POST',
            url: '/chat',
            body: {
                query: '¿Qué es Auktrafi?',
                context: {},
            },
        },
    });
});
// Solo iniciar servidor si no está en Vercel
const PORT = process.env.PORT || 3000;
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`🏠 Auktrafi Info Agent running on port ${PORT}`);
        console.log(`   Web: http://localhost:${PORT}`);
        console.log(`   Health: http://localhost:${PORT}/health`);
        console.log(`   Chat: http://localhost:${PORT}/chat`);
    });
}
// Export para Vercel
export default app;
//# sourceMappingURL=server.js.map