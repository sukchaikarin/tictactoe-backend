// src/auth/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'], // Specify the scopes here
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { name, email, sub:googleId,picture } = profile._json;
    console.log("🚀 ~ GoogleStrategy ~ validate ~ profile._json:", profile._json)
    // Get user info from profile
    const userDto: CreateUserDto = { // Ensure you have a DTO that includes the required fields
        name,
        email,
        googleId,
        picture,
        scores: 0, // ตั้งค่า scores เป็น 0
      
    };

    // Check if the user exists in the database
    let user = await this.usersService.findByEmail(email); // Implement this method in UsersService
    if (!user) {
      // If the user doesn't exist, create a new one
      user = await this.usersService.create(userDto);
    }
    return user; // Return the user object
  }
}
