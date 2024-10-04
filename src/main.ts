// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global settings can be applied here
  // For example, you can set up a global prefix for your routes
  app.setGlobalPrefix('v1'); // Optional: all routes will start with /api

  // You can enable CORS if needed
  app.enableCors();

  await app.listen(3000, '0.0.0.0'); // This would make it accessible on all network interfaces
 // Start the application on port 3000
  console.log(`Application is running on: ${await app.getUrl()}`); // Log the URL
}

bootstrap();
