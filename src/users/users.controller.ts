import { Controller, Get, Post, Body, Param, NotFoundException, Logger, Query, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UserScoresResponse } from './interfaces/user-scores.interface';
import { UserMaxWinsStreakResponse } from './interfaces/user-max-wins-streak.interface';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creating a new user...');
    try {
      const user = await this.usersService.create(createUserDto);
      this.logger.log(`User created successfully: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw error; // Rethrow the error after logging
    }
  }



  @Get('scores') // New endpoint to get users' scores
  async getUserScores(@Query('page') page: number = 1): Promise<UserScoresResponse> {
    this.logger.log(`Fetching scores for page: ${page}`);
    try {
      const limit = 2; // Limit to 2 users per page
      const { users, totalPages } = await this.usersService.getUserScores(page, limit);
      this.logger.log(`Fetched scores successfully for page: ${page}`);
      return { users, totalPages }; // Return users and total pages
    } catch (error) {
      this.logger.error('Error fetching user scores', error.stack);
      throw error; // Rethrow the error after logging
    }
  }

  @Get('max-wins-streak') // New endpoint to get users' max wins streak
  async getUserMaxWinsStreak(@Query('page') page: number = 1): Promise<UserMaxWinsStreakResponse> {
    this.logger.log(`Fetching max wins streak for page: ${page}`);
    try {
      const limit = 2; // Limit to 2 users per page
      const { users, totalPages } = await this.usersService.getUserMaxWinsStreak(page, limit);
      this.logger.log(`Fetched max wins streak successfully for page: ${page}`);
      return { users, totalPages }; // Return users and total pages
    } catch (error) {
      this.logger.error('Error fetching user max wins streak', error.stack);
      throw error; // Rethrow the error after logging
    }
  }

  @Get(':id') // Define the route to get a user by ID
  async findById(@Param('id') id: string): Promise<User> {
    this.logger.log(`Finding user by ID: ${id}`);
    try {
      const user = await this.usersService.findById(id); // Call findById from UsersService
      this.logger.log(`User found: ${user.id}`);
      return user; // Return the user data
    } catch (error) {
      this.logger.error(`Error fetching user with ID ${id}: ${error.message}`);
      throw new NotFoundException(`Error fetching user: ${error.message}`);
    }
  }
  @Patch(':id/scores/increment')
async incrementScore(
  @Param('id') id: string,
  @Body('currentScore') currentScore: number
): Promise<{ message: { en: string; th: string }; user: User; maxWinsStreakUpdated: boolean }> {
  this.logger.log(`Incrementing score for user ID: ${id}`);
  try {
    const { user, maxWinsStreakUpdated } = await this.usersService.incrementScore(id, 1, currentScore);
    this.logger.log(`Score incremented successfully for user ID: ${id}`);

    let message: { en: string; th: string };
    const newHighScore = user.scores; // คะแนนสูงสุดใหม่

    if (maxWinsStreakUpdated) {
      // ถ้ามีการอัปเดต maxWinsStreak
      message = {
        en: `Congratulations, ${user.name}! You've outdone yourself with a new high score of ${newHighScore}! 🎉`,
        th: `ยินดีด้วยนะคุณ ${user.name}! คุณทำคะแนนสูงสุดใหม่ที่ ${newHighScore}! 🎉`,
      };
    } else {
      // ถ้าปกติ
      message = {
        en: `+1 Point! Great job, ${user.name}! Your current score is ${newHighScore}! 🎉`,
        th: `+1 คะแนน! ยินดีด้วยคุณ ${user.name}! คะแนนปัจจุบันของคุณคือ ${newHighScore}! 🎉`,
      };
    }

    return {
      message: message,
      user: user,
      maxWinsStreakUpdated: maxWinsStreakUpdated, // ส่งกลับสถานะการอัปเดต
    };
  } catch (error) {
    this.logger.error(`Error incrementing score for user ID ${id}: ${error.message}`);
    throw new NotFoundException(`Error updating score: ${error.message}`);
  }
}

  
@Patch(':id/scores/increment-2') // เพิ่ม 2 คะแนน
async incrementScoreByTwo(
    @Param('id') id: string,
    @Body('currentScore') currentScore: number // รับคะแนนปัจจุบันจากบอดี
): Promise<{ message: { en: string; th: string }; user: User; maxWinsStreakUpdated: boolean }> {
    this.logger.log(`Incrementing score by 2 for user ID: ${id}`);
    try {
        const { user, maxWinsStreakUpdated } = await this.usersService.incrementScore(id, 2, currentScore);
        this.logger.log(`Score incremented by 2 successfully for user ID: ${id}`);

        let message: { en: string; th: string };
        const newHighScore = user.scores; // คะแนนสูงสุดใหม่

        if (maxWinsStreakUpdated) {
            // ถ้ามีการอัปเดต maxWinsStreak
            message = {
                en: `Congratulations, ${user.name}! You've outdone yourself with a new high score of ${newHighScore}! 🎉`,
                th: `ยินดีด้วยนะคุณ ${user.name}! คุณทำคะแนนสูงสุดใหม่ที่ ${newHighScore}! 🎉`,
            };
        } else {
            // ถ้าปกติ
            message = {
                en: `+2 Points! You're unstoppable, ${user.name}! Your current score is ${newHighScore}! 🚀`,
                th: `+2 คะแนน! คุณ ${user.name} หยุดไม่ได้แล้ว! คะแนนปัจจุบันของคุณคือ ${newHighScore}! 🚀`,
            };
        }

        return {
            message: message,
            user: user,
            maxWinsStreakUpdated: maxWinsStreakUpdated // ส่งกลับสถานะการอัปเดต
        };
    } catch (error) {
        this.logger.error(`Error incrementing score by 2 for user ID ${id}: ${error.message}`);
        throw new NotFoundException(`Error updating score: ${error.message}`);
    }
}

  
  @Patch(':id/scores/decrement') // ลด 1 คะแนน
  async decrementScore(@Param('id') id: string): Promise<{ message: { en: string; th: string }; user: User }> {
      this.logger.log(`Decrementing score for user ID: ${id}`);
      try {
          const user = await this.usersService.decrementScore(id, 1);
          this.logger.log(`Score decremented successfully for user ID: ${id}`);
  
          return {
              message: {
                  en: `-1 Point! Don't give up, ${user.name}! 💪`,
                  th: `-1 คะแนน! อย่ายอมแพ้คุณ ${user.name}! 💪`,
              },
              user: user, // ส่งข้อมูลของผู้ใช้กลับมา
          };
      } catch (error) {
          this.logger.error(`Error decrementing score for user ID ${id}: ${error.message}`);
          throw new NotFoundException(`Error updating score: ${error.message}`);
      }
  }
  
  @Patch(':id/scores/reset') // ลบคะแนนทั้งหมด
  async resetScore(@Param('id') id: string): Promise<{ message: { en: string; th: string }; user: User }> {
      this.logger.log(`Resetting score for user ID: ${id}`);
      try {
          const user = await this.usersService.resetScore(id);
          this.logger.log(`Score reset successfully for user ID: ${id}`);
  
          return {
              message: {
                  en: `Score reset! Time for a fresh start, ${user.name}! 🔄`,
                  th: `คะแนนถูกรีเซ็ต! ถึงเวลาเริ่มต้นใหม่คุณ ${user.name}! 🔄`,
              },
              user: user, // ส่งข้อมูลของผู้ใช้กลับมา
          };
      } catch (error) {
          this.logger.error(`Error resetting score for user ID ${id}: ${error.message}`);
          throw new NotFoundException(`Error updating score: ${error.message}`);
      }
  }
  


}
