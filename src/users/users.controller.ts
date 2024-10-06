import { Controller, Get, Post, Body, Param, NotFoundException, Logger, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UserScoresResponse } from './interfaces/user-scores.interface';
import { UserMaxWinsStreakResponse } from './interfaces/user-max-wins-streak.interface';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

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
  // Uncomment if you want to implement findAll method
  // @Get()
  // async findAll() {
  //   return await this.usersService.findAll();
  // }

  // Uncomment if you want to implement findOne method
  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return await this.usersService.findOne(id);
  // }
}
