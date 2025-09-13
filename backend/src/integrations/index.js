/**
 * Integrations Manager
 * 
 * Gerenciador central para todas as integrações de bots
 */

const WhatsAppBot = require('./whatsapp/whatsappBot');
const TelegramBot = require('./telegram/telegramBot');

class IntegrationsManager {
  constructor() {
    this.whatsappBot = new WhatsAppBot();
    this.telegramBot = new TelegramBot();
    this.activeIntegrations = [];
  }

  /**
   * Inicializa todas as integrações habilitadas
   */
  async initialize() {
    console.log('🚀 Initializing bot integrations...');

    // Initialize WhatsApp if enabled
    if (process.env.ENABLE_WHATSAPP === 'true') {
      try {
        await this.whatsappBot.initialize();
        this.activeIntegrations.push('whatsapp');
        console.log('✅ WhatsApp bot initialized');
      } catch (error) {
        console.error('❌ WhatsApp initialization failed:', error.message);
      }
    }

    // Initialize Telegram if enabled
    if (process.env.ENABLE_TELEGRAM === 'true') {
      try {
        await this.telegramBot.initialize();
        this.activeIntegrations.push('telegram');
        console.log('✅ Telegram bot initialized');
      } catch (error) {
        console.error('❌ Telegram initialization failed:', error.message);
      }
    }

    if (this.activeIntegrations.length === 0) {
      console.log('📱 No bot integrations enabled. Add ENABLE_WHATSAPP=true or ENABLE_TELEGRAM=true to .env');
    } else {
      console.log(`🤖 Active integrations: ${this.activeIntegrations.join(', ')}`);
    }
  }

  /**
   * Para todas as integrações ativas
   */
  async shutdown() {
    console.log('⏹️ Shutting down bot integrations...');
    
    if (this.activeIntegrations.includes('whatsapp')) {
      await this.whatsappBot.stop();
    }
    
    if (this.activeIntegrations.includes('telegram')) {
      await this.telegramBot.stop();
    }
    
    this.activeIntegrations = [];
    console.log('✅ All bot integrations stopped');
  }

  /**
   * Retorna status das integrações
   */
  getStatus() {
    return {
      whatsapp: {
        enabled: process.env.ENABLE_WHATSAPP === 'true',
        active: this.activeIntegrations.includes('whatsapp'),
        ready: this.whatsappBot.isReady || false
      },
      telegram: {
        enabled: process.env.ENABLE_TELEGRAM === 'true',
        active: this.activeIntegrations.includes('telegram'),
        ready: this.telegramBot.isActive || false
      }
    };
  }
}

module.exports = IntegrationsManager;