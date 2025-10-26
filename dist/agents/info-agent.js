/**
 * Agente Informativo de Auktrafi
 * Proporciona información sobre la plataforma de reservas y subastas inmobiliarias
 */
import { ASIOneCompatibleAgent } from './asi-one-compatible/base-agent.js';
import { AgentChatProtocol } from '../protocols/agent-chat-protocol.js';
export class AuktrafiInfoAgent extends ASIOneCompatibleAgent {
    constructor() {
        super('auktrafi-info-agent', {
            name: 'Auktrafi Information Agent',
            description: 'Proporciona información sobre Auktrafi, la plataforma descentralizada de reservas y subastas de bienes raíces',
            capabilities: [
                'provide_platform_info',
                'explain_reservation_process',
                'explain_auction_process',
                'answer_faqs',
                'describe_features',
            ],
            supportedTasks: [
                'get_platform_info',
                'explain_how_it_works',
                'answer_question',
            ],
        });
    }
    async processRequest(request) {
        const { query, context } = request;
        const intent = this.parseIntent(query);
        switch (intent.type) {
            case 'platform_info':
                return this.handlePlatformInfo();
            case 'reservation_info':
                return this.handleReservationInfo();
            case 'auction_info':
                return this.handleAuctionInfo();
            case 'features':
                return this.handleFeatures();
            case 'faq':
                return this.handleFAQ(query);
            case 'help':
                return this.handleHelp();
            default:
                return this.handleGeneralInfo(query);
        }
    }
    handlePlatformInfo() {
        return AgentChatProtocol.createResponse(this.agentId, `🏠 **Auktrafi** es una plataforma descentralizada para reservas y subastas de bienes raíces.

**¿Qué es Auktrafi?**
- Plataforma Web3 para tokenizar propiedades inmobiliarias
- Sistema de reservas con PYUSD (stablecoin de PayPal)
- Subastas descentralizadas para reservas exclusivas
- Desplegado en Ethereum y Arbitrum

**Características principales:**
• Tokenización de propiedades (vaults)
• Reservas mediante staking de PYUSD
• Subastas competitivas para reservas exclusivas
• Totalmente descentralizado y transparente

Visita: https://auktrafi.xyz`, 'success', {
            platform: 'Auktrafi',
            url: 'https://auktrafi.xyz',
            chains: ['Ethereum', 'Arbitrum'],
            token: 'PYUSD',
        }, 'Información general de la plataforma Auktrafi', ['¿Cómo funcionan las reservas?', '¿Cómo funcionan las subastas?', 'Ver características']);
    }
    handleReservationInfo() {
        return AgentChatProtocol.createResponse(this.agentId, `📋 **Proceso de Reserva en Auktrafi:**

1. **Explorar Propiedades**: Navega las propiedades tokenizadas disponibles
2. **Seleccionar Propiedad**: Elige la propiedad que deseas reservar
3. **Staking PYUSD**: Haz stake de PYUSD para reservar la propiedad
4. **Confirmación**: La reserva se confirma en blockchain
5. **Gestión**: Puedes gestionar tu reserva desde tu wallet

**Beneficios:**
✅ Transparencia total en blockchain
✅ Sin intermediarios
✅ Control directo con tu wallet
✅ Fondos seguros con PYUSD

**Requisitos:**
- Wallet compatible (MetaMask, Coinbase Wallet, etc.)
- PYUSD para staking
- Conexión a Ethereum o Arbitrum`, 'success', {
            process: 'reservation',
            steps: ['explore', 'select', 'stake_pyusd', 'confirm', 'manage'],
            requirements: ['wallet', 'pyusd', 'chain_connection'],
        }, 'Proceso completo de reserva explicado');
    }
    handleAuctionInfo() {
        return AgentChatProtocol.createResponse(this.agentId, `🏆 **Subastas en Auktrafi:**

Las subastas permiten competir por reservas exclusivas de propiedades premium.

**Cómo funciona:**
1. **Propietario crea subasta**: Define precio inicial y duración
2. **Participantes pujan**: Los usuarios pujan con PYUSD
3. **Subasta activa**: Período determinado para recibir pujas
4. **Ganador final**: Mayor puja al finalizar gana la reserva
5. **Confirmación onchain**: Todo registrado en blockchain

**Ventajas:**
🎯 Acceso a propiedades exclusivas
💰 Precios competitivos mediante pujas
⏰ Transparencia en tiempo real
🔒 Seguridad garantizada por blockchain

**Estrategia de puja:**
- Monitorea las pujas actuales
- Considera tu presupuesto PYUSD
- Puja estratégicamente antes del cierre`, 'success', {
            process: 'auction',
            stages: ['creation', 'bidding', 'active', 'winner', 'confirmation'],
        }, 'Proceso de subastas explicado');
    }
    handleFeatures() {
        return AgentChatProtocol.createResponse(this.agentId, `✨ **Características de Auktrafi:**

🔐 **Descentralización**
- Todo en blockchain (Ethereum/Arbitrum)
- Sin custodia centralizada
- Transparencia total

💰 **PYUSD Integration**
- Stablecoin respaldada por PayPal
- Estabilidad de precio
- Fácil conversión

🏗️ **Property Vaults**
- Tokenización de propiedades reales
- Gestión descentralizada
- Propiedad fraccionada posible

📊 **Reservas y Subastas**
- Sistema dual de acceso
- Reservas directas y competitivas
- Gestión completa desde wallet

🌐 **Multi-Chain**
- Disponible en Ethereum
- Disponible en Arbitrum
- Flexibilidad de red

🔧 **Powered by Hardhat**
- Contratos verificados
- Desarrollo profesional
- Seguridad auditada`, 'success', {
            features: [
                'decentralization',
                'pyusd_integration',
                'property_vaults',
                'reservations_auctions',
                'multi_chain',
                'hardhat_powered',
            ],
        }, 'Características principales listadas');
    }
    handleFAQ(query) {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('qué es') || lowerQuery.includes('what is')) {
            return this.handlePlatformInfo();
        }
        if (lowerQuery.includes('cómo reservar') || lowerQuery.includes('how to reserve')) {
            return this.handleReservationInfo();
        }
        if (lowerQuery.includes('cómo funciona') || lowerQuery.includes('how does it work')) {
            return AgentChatProtocol.createResponse(this.agentId, `🔄 **¿Cómo funciona Auktrafi?**

Auktrafi conecta propietarios y usuarios a través de blockchain:

**Para Propietarios:**
1. Tokeniza tu propiedad creando un vault
2. Define precios y disponibilidad
3. Puedes crear subastas para propiedades exclusivas
4. Recibe PYUSD directamente a tu wallet

**Para Usuarios:**
1. Conecta tu wallet
2. Explora propiedades disponibles
3. Reserva directamente o participa en subastas
4. Gestiona todo desde tu wallet

**Tecnología:**
- Smart contracts en Ethereum/Arbitrum
- PYUSD para transacciones
- Interface Web3 intuitiva`, 'success');
        }
        if (lowerQuery.includes('precio') || lowerQuery.includes('price') || lowerQuery.includes('cost')) {
            return AgentChatProtocol.createResponse(this.agentId, `💰 **Precios y Costos:**

**Reservas:**
- El precio depende de cada propiedad
- Pagas con PYUSD (stablecoin estable)
- No hay comisiones ocultas
- Solo pagas gas fees de blockchain

**Subastas:**
- Precio inicial definido por el propietario
- Pujas competitivas determinan el precio final
- Transparencia total en todas las pujas

**Gas Fees:**
- Ethereum: Fees variables según red
- Arbitrum: Fees más bajos (recomendado)
- Usa la red que prefieras

**PYUSD:**
- 1 PYUSD ≈ $1 USD
- Estable y respaldado por PayPal
- Fácil de obtener y usar`, 'success');
        }
        // Respuesta genérica para FAQ
        return AgentChatProtocol.createResponse(this.agentId, `Preguntas frecuentes sobre Auktrafi:

• ¿Qué es Auktrafi? - Plataforma descentralizada de bienes raíces
• ¿Cómo reservo? - Haz stake de PYUSD en la propiedad
• ¿Cómo funcionan las subastas? - Compite con pujas PYUSD
• ¿Qué es PYUSD? - Stablecoin de PayPal
• ¿Qué chains soporta? - Ethereum y Arbitrum

Haz una pregunta específica para más detalles.`, 'success');
    }
    handleHelp() {
        return AgentChatProtocol.createResponse(this.agentId, `👋 ¡Hola! Soy el Agente Informativo de Auktrafi.

Puedo ayudarte con:
📌 Información sobre la plataforma
📋 Cómo funcionan las reservas
🏆 Cómo funcionan las subastas
✨ Características principales
❓ Preguntas frecuentes

Ejemplos de preguntas:
• "¿Qué es Auktrafi?"
• "¿Cómo reservo una propiedad?"
• "¿Cómo funcionan las subastas?"
• "¿Qué características tiene?"
• "¿Qué es PYUSD?"

¡Pregúntame lo que necesites! 🏠`, 'success', undefined, 'Información de ayuda del agente', ['Ver información de la plataforma', 'Cómo reservar', 'Cómo funcionan las subastas']);
    }
    handleGeneralInfo(query) {
        return AgentChatProtocol.createResponse(this.agentId, `Información sobre Auktrafi:

Auktrafi es una plataforma descentralizada para reservas y subastas de bienes raíces usando PYUSD en Ethereum y Arbitrum.

Para información específica, pregunta sobre:
• La plataforma en general
• Proceso de reservas
• Sistema de subastas
• Características principales

O di "ayuda" para ver todas las opciones disponibles.`, 'success', { query }, 'Respuesta general a consulta');
    }
    parseIntent(query) {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('qué es') || lowerQuery.includes('what is') || lowerQuery.includes('información')) {
            return { type: 'platform_info', confidence: 0.9 };
        }
        if (lowerQuery.includes('reserva') || lowerQuery.includes('reserve')) {
            return { type: 'reservation_info', confidence: 0.9 };
        }
        if (lowerQuery.includes('subasta') || lowerQuery.includes('auction')) {
            return { type: 'auction_info', confidence: 0.9 };
        }
        if (lowerQuery.includes('característica') || lowerQuery.includes('feature')) {
            return { type: 'features', confidence: 0.9 };
        }
        if (lowerQuery.includes('pregunta') || lowerQuery.includes('faq') || lowerQuery.includes('cómo')) {
            return { type: 'faq', confidence: 0.8 };
        }
        if (lowerQuery.includes('ayuda') || lowerQuery.includes('help')) {
            return { type: 'help', confidence: 1.0 };
        }
        return { type: 'general', confidence: 0.5 };
    }
}
//# sourceMappingURL=info-agent.js.map