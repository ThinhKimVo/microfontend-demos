import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';
import * as functions from 'firebase-functions';

// Express instance for Firebase
const expressApp = express();

async function setupApp(app: INestApplication) {
  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3100',
      'http://localhost:3101',
      'http://10.30.10.18:3100',
      'http://10.30.10.18:3101',
      'https://demo.saigontechnology.vn',
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation (only in dev or if explicitly enabled)
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Hopeful API')
      .setDescription('Telehealth therapy platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }
}

// Firebase Cloud Function Export
export const api = functions.https.onRequest(async (request, response) => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  await setupApp(app);
  await app.init();
  expressApp(request, response);
});

// Local development bootstrap
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupApp(app);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

// Only bootstrap locally if not in Firebase environment
if (!process.env.FIREBASE_CONFIG && !process.env.FUNCTION_NAME) {
  bootstrap();
}
