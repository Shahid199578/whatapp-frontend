// src/workers/message-worker.ts
import { Worker } from 'bullmq';
import { createConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import axios from 'axios';

const logger = new Logger('MessageWorker');

// Database connection
const connection = await createConnection({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});

// Redis connection for BullMQ
const redisConfig = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

// Message processing worker
const messageWorker = new Worker(
  'message-queue',
  async (job) => {
    const { messageId, phoneNumberId, to, content, type } = job.data;

    try {
      logger.log(`Processing message ${messageId}`);

      // Get phone number and tenant info from database
      const phoneNumberRepo = connection.getRepository('PhoneNumber');
      const messageRepo = connection.getRepository('Message');
      const tenantRepo = connection.getRepository('Tenant');

      const phoneNumber = await phoneNumberRepo.findOne({
        where: { id: phoneNumberId },
        relations: ['tenant'],
      });

      if (!phoneNumber) {
        throw new Error(`Phone number ${phoneNumberId} not found`);
      }

      // Rate limiting check - implement per phone number
      await checkRateLimit(phoneNumberId);

      // Prepare WhatsApp API request
      const whatsappApiUrl = `https://graph.facebook.com/v18.0/${phoneNumber.whatsappBusinessPhoneNumberId}/messages`;
      
      const headers = {
        'Authorization': `Bearer ${phoneNumber.tenant.metaAppSecret}`,
        'Content-Type': 'application/json',
      };

      let messagePayload: any = {
        messaging_product: 'whatsapp',
        to: to,
      };

      // Build message payload based on type
      if (type === 'text') {
        messagePayload.type = 'text';
        messagePayload.text = { body: content.text };
      } else if (type === 'template') {
        messagePayload.type = 'template';
        messagePayload.template = content.template;
      } else if (type === 'media') {
        messagePayload.type = content.mediaType; // image, video, document, audio
        messagePayload[content.mediaType] = {
          link: content.mediaUrl,
          caption: content.caption,
        };
      }

      // Send message to WhatsApp Cloud API
      const response = await axios.post(whatsappApiUrl, messagePayload, { headers });

      // Update message status in database
      await messageRepo.update(messageId, {
        status: 'sent',
        whatsappMessageId: response.data.messages.id,
        sentAt: new Date(),
      });

      // Track usage for billing
      await trackUsage(phoneNumber.tenantId, phoneNumberId);

      logger.log(`Message ${messageId} sent successfully`);
      
      return { success: true, whatsappMessageId: response.data.messages.id };

    } catch (error) {
      logger.error(`Failed to send message ${messageId}:`, error);
      
      // Update message with error status
      const messageRepo = connection.getRepository('Message');
      await messageRepo.update(messageId, {
        status: 'failed',
        errorCode: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
        errorMessage: error.response?.data?.error?.message || error.message,
      });

      // Handle specific WhatsApp API errors
      if (error.response?.data?.error?.code === 130429) {
        // Rate limit exceeded - retry with exponential backoff
        const retryDelay = Math.pow(2, job.attemptsMade) * 1000; // 1s, 2s, 4s, 8s...
        logger.warn(`Rate limited. Retrying in ${retryDelay}ms`);
        throw new Error('Rate limited - will retry');
      }

      if (error.response?.data?.error?.code === 131026) {
        // Message template not found or not approved
        throw new Error('Template not approved or not found');
      }

      if (error.response?.data?.error?.code === 131021) {
        // Recipient not available on WhatsApp
        throw new Error('Recipient not available on WhatsApp');
      }

      throw error;
    }
  },
  {
    connection: redisConfig,
    concurrency: 10, // Process up to 10 messages concurrently
    limiter: {
      max: 80, // 80 messages per second (WhatsApp default limit)
      duration: 1000,
    },
  }
);

// Rate limiting implementation
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

async function checkRateLimit(phoneNumberId: string) {
  const now = Date.now();
  const windowSize = 1000; // 1 second window
  const maxMessages = 80; // WhatsApp default limit

  const current = rateLimitMap.get(phoneNumberId) || { count: 0, resetTime: now + windowSize };

  if (now > current.resetTime) {
    // Reset window
    current.count = 0;
    current.resetTime = now + windowSize;
  }

  if (current.count >= maxMessages) {
    throw new Error(`Rate limit exceeded for phone number ${phoneNumberId}`);
  }

  current.count++;
  rateLimitMap.set(phoneNumberId, current);
}

// Usage tracking for billing
async function trackUsage(tenantId: string, phoneNumberId: string) {
  const usageRepo = connection.getRepository('UsageRecord');
  const today = new Date().toISOString().split('T');

  try {
    const existingUsage = await usageRepo.findOne({
      where: { tenantId, phoneNumberId, date: new Date(today) },
    });

    if (existingUsage) {
      await usageRepo.update(existingUsage.id, {
        messageCount: existingUsage.messageCount + 1,
        costCents: existingUsage.costCents + 12, // 12 cents per message (10 cents + 2 cents margin)
      });
    } else {
      await usageRepo.save({
        tenantId,
        phoneNumberId,
        date: new Date(today),
        messageCount: 1,
        costCents: 12,
      });
    }
  } catch (error) {
    logger.error('Failed to track usage:', error);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.log('Shutting down message worker...');
  await messageWorker.close();
  await connection.close();
  process.exit(0);
});

logger.log('Message worker started successfully');
