// src/auth/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
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
    const { name, email, sub: googleId, picture } = profile._json;

    // Get user info from profile
    const userDto: CreateUserDto = {
      name,  // This should be an object if your schema expects it
      email,
      googleId,
      picture,
      scores: 0, // Set scores to 0
    };

    // Check if the user exists in the database
    let user = await this.usersService.findByGoogleId(googleId); // Implement this method in UsersService
    if (!user) {
      // If the user doesn't exist, create a new one
      user = await this.usersService.create(userDto);
    } else {
      // If the user exists, compare and update if necessary
      const updatedUserData = {
        ...user.toObject(), // Convert Mongoose Document to plain object
        name,
        picture,
      };

      // Update user in database if there are any changes
      if (
        user.name !== updatedUserData.name || 
        user.picture !== updatedUserData.picture
      ) {
        await this.usersService.update(String(user._id), updatedUserData); // Ensure you implement the update method
      }
    }
    return user; // Return the user object
  }
}
