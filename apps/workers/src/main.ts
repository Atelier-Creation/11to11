import { NestFactory } from '@nestjs/core';
import { WorkersModule } from './workers.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AtelierWorkerService');
  const app = await NestFactory.createApplicationContext(WorkersModule);

  logger.log('11 11 Asynchronous Worker Service (BullMQ) is running');

  // Handle graceful shutdown
  const shutdown = async () => {
    logger.log('Shutting down worker service gracefully...');
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap();
