// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
//test vercel.json
  // Global settings can be applied here
  // For example, you can set up a global prefix for your routes
  app.setGlobalPrefix('v1'); // Optional: all routes will start with /api
  app.use(cookieParser());
 // เปิดใช้ Helmet สำหรับการตั้งค่า CSP
 app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }),
);
  const isProduction = process.env.NODE_ENV === 'production';
  const origin = isProduction
    ? 'https://tictactoe-frontend-smoky.vercel.app' // URL ของโปรดักชัน
    : 'http://localhost:3000'; // URL ของการทดสอบใน localhost

  // ตั้งค่า CORS
  app.enableCors({
    origin: "https://tictactoe-frontend-smoky.vercel.app",
    credentials: true, // อนุญาตให้ส่ง cookies
  });
  const PORT = process.env.PORT || 3001; 

  await app.listen(PORT, '0.0.0.0'); // This would make it accessible on all network interfaces
 // Start the application on port 3000
  console.log(`Application is running on: ${await app.getUrl()}`); // Log the URL
}

bootstrap();
