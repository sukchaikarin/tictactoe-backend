// src/users/users.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserScoresResponse, UserScore } from './interfaces/user-scores.interface';
import { UserMaxWinsStreak, UserMaxWinsStreakResponse } from './interfaces/user-max-wins-streak.interface';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Creating a new user...');
    const createdUser = new this.userModel(createUserDto);

    try {
      const savedUser = await createdUser.save();
      this.logger.log(`User created: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw error; // Rethrow the error after logging
    }
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    this.logger.log(`Finding user by Google ID: ${googleId}`);
    try {
      const user = await this.userModel.findOne({ googleId }).exec();
      if (!user) {
        this.logger.warn(`User with Google ID: ${googleId} not found`);
      }
      return user; // Returns the user if found or null
    } catch (error) {
      this.logger.error(`Error finding user by Google ID: ${googleId}`, error.stack);
      throw error; // Rethrow the error after logging
    }
  }

  async findById(id: string): Promise<User | null> {
    this.logger.log(`Finding user by ID: ${id}`);
    try {
      const user = await this.userModel.findById(id).exec(); // Find user by ID
      if (!user) {
        this.logger.warn(`User with ID: ${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found`); // Handle not found
      }
      return user; // Return the found user
    } catch (error) {
      this.logger.error(`Error finding user by ID: ${id}`, error.stack);
      throw error; // Rethrow the error after logging
    }
  }

  async update(userId: string, userDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${userId}`);
    userDto.updatedAt = new Date();
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, userDto, { new: true }).exec();
      if (!updatedUser) {
        this.logger.warn(`User with ID: ${userId} not found for update`);
        throw new NotFoundException(`User with ID ${userId} not found for update`);
      }
      this.logger.log(`User updated: ${updatedUser.id}`);
      return updatedUser;
    } catch (error) {
      this.logger.error('Error updating user', error.stack);
      throw error; // Rethrow the error after logging
    }
  }

  async getUserScores(page: number, limit: number): Promise<UserScoresResponse> {
    this.logger.log(`Fetching user scores for page: ${page} with limit: ${limit}`);

    try {
      const totalCount = await this.userModel.countDocuments().exec(); // Count total users   
      const skipValue = (page - 1) * limit;
      const users: UserScore[] = await this.userModel
        .find()
        .sort({ scores: -1, name: 1 })
        .skip(skipValue)
        .limit(limit)
        .select({ name: 1, scores: 1, _id: 0 })
        .exec();
      const totalPages = Math.ceil(totalCount / limit); // Calculate total pages
      // Debugging logs
      this.logger.log(`Total Count: ${totalCount}, Total Pages: ${totalPages}, Users Fetched: ${users.length}`);
      return { users, totalPages }; // Return users and total count
    } catch (error) {
      this.logger.error('Error fetching user scores', error.stack);
      throw error; // Rethrow the error after logging
    }
  }

  async getUserMaxWinsStreak(page: number, limit: number): Promise<UserMaxWinsStreakResponse> {
    this.logger.log(`Fetching user max wins streak for page: ${page} with limit: ${limit}`);

    try {
        const totalCount = await this.userModel.countDocuments().exec(); // Count total users   
        const skipValue = (page - 1) * limit;

        const users: UserMaxWinsStreak[] = await this.userModel
            .find()
            .sort({ maxWinsStreak: -1, name: 1 })
            .skip(skipValue)
            .limit(limit)
            .select({ name: 1, maxWinsStreak: 1, _id: 0 }) // เลือกเฉพาะฟิลด์ที่ต้องการ
            .exec();

        const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

        // Debugging logs
        this.logger.log(`Total Count: ${totalCount}, Total Pages: ${totalPages}, Users Fetched: ${users.length}`);

        return { users, totalPages }; // Return users and total count
    } catch (error) {
        this.logger.error('Error fetching user max wins streak', error.stack);
        throw error; // Rethrow the error after logging
    }
}


}
