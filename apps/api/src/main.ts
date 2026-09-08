import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('AtelierBootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Cookies & Security
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.STOREFRONT_URL || 'http://localhost:3000',
      process.env.ADMIN_URL || 'http://localhost:3001',
    ],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('11 11 Luxury Fashion API')
    .setDescription(
      'Editorial-grade e-commerce REST API powering the 11 11 luxury fashion platform. Supports multi-attribute variant catalog, atomic inventory reservations, shopping bags, order processing, and payment webhooks.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: '11 11 Atelier API Documentation',
  });

  const port = process.env.API_PORT || 4000;
  await app.listen(port);
  logger.log(`11 11 Luxury Modular API is listening on port ${port} (Swagger docs: http://localhost:${port}/api/docs)`);
}

bootstrap();
