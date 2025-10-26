/**
 * Auktrafi Info Agent
 * Agente informativo compatible con ASI One y Agentverse
 */
import { config } from 'dotenv';
import { AuktrafiInfoAgent } from './agents/info-agent.js';
config();
/**
 * Inicializa el agente informativo de Auktrafi
 */
export function initializeInfoAgent() {
    // Crear agente informativo
    const infoAgent = new AuktrafiInfoAgent();
    console.log('🏠 Auktrafi Info Agent inicializado');
    console.log(`   Agent ID: ${infoAgent.getMetadata().agent_id}`);
    console.log(`   Descripción: ${infoAgent.getMetadata().description}`);
    return {
        infoAgent,
    };
}
// Exportar para uso en otros módulos
export { AuktrafiInfoAgent };
export * from './protocols/agent-chat-protocol.js';
export * from './agents/asi-one-compatible/base-agent.js';
// Ejemplo de uso si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    const { infoAgent } = initializeInfoAgent();
    // Ejemplo de uso
    console.log('\n💬 Ejemplo de uso:');
    console.log('');
    infoAgent
        .handleRequest({
        query: '¿Qué es Auktrafi?',
        context: {},
    })
        .then((response) => {
        console.log('Pregunta: ¿Qué es Auktrafi?');
        console.log(`Respuesta: ${response.message}\n`);
    });
}
//# sourceMappingURL=index.js.map