// src/users/users.service.ts
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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


async incrementScore(id: string, points: number = 1, currentScore?: number): Promise<{ user: User; maxWinsStreakUpdated: boolean }> {
  // ตรวจสอบว่า currentScore เป็น undefined หรือไม่
  if (currentScore === undefined) {
    this.logger.error(`Current score is undefined for user ID: ${id}`);
    throw new BadRequestException('Current score must be provided');
  }
 const newScore = currentScore + points;
  const session = await this.userModel.startSession();
  session.startTransaction();

  try {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        $inc: { scores: points },
        $set: { updatedAt: new Date() },
      },
      { new: true, session }
    ).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // เช็กว่าคะแนนปัจจุบันมากกว่าคะแนนสูงสุดหรือไม่
    let maxWinsStreakUpdated = false; // ตัวแปรสำหรับตรวจสอบว่ามีการอัปเดต maxWinsStreak หรือไม่
    if (newScore > user.maxWinsStreak) {
      user.maxWinsStreak = newScore; // อัปเดต maxWinsStreak
      await user.save({ session }); // บันทึกการเปลี่ยนแปลง
      this.logger.log(`Max wins streak updated for user ID: ${id} to new value: ${currentScore}`);
      maxWinsStreakUpdated = true; // เปลี่ยนค่าเป็น true เมื่อต้องอัปเดต
    } else {
      this.logger.log(`No update needed for user ID: ${id}. Current score is not greater than maxWinsStreak.`);
    }

    // Commit the transaction only once
    await session.commitTransaction();
    return { user, maxWinsStreakUpdated }; // ส่งกลับผลลัพธ์
  } catch (error) {
    await session.abortTransaction();
    this.logger.error(`Error incrementing score for user ID ${id}: ${error.message}`);
    throw new NotFoundException(`Error updating score: ${error.message}`);
  } finally {
    session.endSession();
  }
}



async decrementScore(id: string, points: number): Promise<User> {
  const user = await this.userModel.findByIdAndUpdate(
    id,
    {
      $inc: { scores: -points }, // ลดคะแนน
      $set: { updatedAt: new Date() }, // ตั้งเวลาอัปเดต
    },
    { new: true } // คืนค่าผู้ใช้ที่ถูกอัปเดต
  ).exec();

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user; // คืนค่าผู้ใช้ที่ถูกอัปเดต
}

async resetScore(id: string): Promise<User> {
  const user = await this.userModel.findByIdAndUpdate(
    id,
    {
      scores: 0, // ลบคะแนนทั้งหมด
      $set: { updatedAt: new Date() }, // ตั้งเวลาอัปเดต
    },
    { new: true } // คืนค่าผู้ใช้ที่ถูกอัปเดต
  ).exec();

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user; // คืนค่าผู้ใช้ที่ถูกอัปเดต
}


}
