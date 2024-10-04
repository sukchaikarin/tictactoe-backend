// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller';
import { JwtAuthService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // นำเข้า ConfigModule
    JwtModule.registerAsync({
      imports: [ConfigModule], // นำเข้า ConfigModule ที่นี่ด้วย
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // ใช้ค่า JWT_SECRET
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') }, // ใช้ค่า JWT_EXPIRES_IN
      }),
      inject: [ConfigService], // ใช้ ConfigService
    }),
    PassportModule,
    UsersModule,
  ],
  providers: [GoogleStrategy, JwtAuthService],
  controllers: [AuthController],
})
export class AuthModule {}
