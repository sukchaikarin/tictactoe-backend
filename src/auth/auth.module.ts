// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller'; // Import your AuthController

@Module({
  imports: [PassportModule, UsersModule],
  providers: [GoogleStrategy],
  controllers: [AuthController], // Register your AuthController
})
export class AuthModule {}
