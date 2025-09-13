/**
 * WhatsApp Bot Integration
 * 
 * Este arquivo contém a integração básica com WhatsApp usando whatsapp-web.js
 * Para ativar, instale as dependências e configure as variáveis de ambiente
 */

const { generateResponse } = require('../../services/openai');

class WhatsAppBot {
  constructor() {
    this.client = null;
    this.isReady = false;
  }

  /**
   * Inicializa o bot do WhatsApp
   * Descomente e configure quando quiser ativar
   */
  async initialize() {
    try {
      // Uncomment when ready to use:
      /*
      const { Client, LocalAuth } = require('whatsapp-web.js');
      
      this.client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      this.client.on('qr', (qr) => {
        console.log('WhatsApp QR Code:', qr);
        // You can generate QR code image here
      });

      this.client.on('ready', () => {
        console.log('✅ WhatsApp bot is ready!');
        this.isReady = true;
      });

      this.client.on('message', async (message) => {
        await this.handleMessage(message);
      });

      await this.client.initialize();
      */
      
      console.log('📱 WhatsApp integration ready for setup');
    } catch (error) {
      console.error('❌ WhatsApp initialization error:', error);
    }
  }

  /**
   * Processa mensagens recebidas do WhatsApp
   */
  async handleMessage(message) {
    try {
      // Ignore messages from groups or own messages
      if (message.from.includes('@g.us') || message.fromMe) {
        return;
      }

      const userMessage = message.body.trim();
      if (!userMessage) return;

      // Get user phone number for context
      const userId = message.from;
      
      // Generate AI response using existing service
      const aiResponse = await generateResponse(
        userMessage, 
        'personal', // Default persona for WhatsApp
        'free', // Free mode for WhatsApp
        [] // No conversation history for now
      );

      // Send response back to WhatsApp
      await message.reply(aiResponse);
      
      console.log(`📱 WhatsApp message processed for ${userId}`);
    } catch (error) {
      console.error('❌ WhatsApp message handling error:', error);
      await message.reply('Desculpe, ocorreu um erro. Tente novamente.');
    }
  }

  /**
   * Envia mensagem para um número específico
   */
  async sendMessage(phoneNumber, message) {
    if (!this.isReady) {
      throw new Error('WhatsApp bot not ready');
    }
    
    // Uncomment when ready to use:
    /*
    const chatId = phoneNumber + '@c.us';
    await this.client.sendMessage(chatId, message);
    */
  }

  /**
   * Para o bot
   */
  async stop() {
    if (this.client) {
      await this.client.destroy();
      this.isReady = false;
    }
  }
}

module.exports = WhatsAppBot;