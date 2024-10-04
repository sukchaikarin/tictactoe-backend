// src/users/users.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Creating a new user...');
    const createdUser = new this.userModel(createUserDto);
  
    try {
      const savedUser = await createdUser.save();
      this.logger.log(`User created: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw error;
    }
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ googleId }).exec(); // Returns the user if found or null
    } catch (error) {
      this.logger.error(`Error finding user by Google ID: ${googleId}`, error.stack);
      throw error; // Rethrow the error after logging
    }
  }

  async update(userId: string, userDto: UpdateUserDto): Promise<User> {
    userDto.updatedAt = new Date(); 
    try {
      return await this.userModel.findByIdAndUpdate(userId, userDto, { new: true }).exec();
    } catch (error) {
      this.logger.error('Error updating user', error.stack);
      throw error;
    }
  }
}
