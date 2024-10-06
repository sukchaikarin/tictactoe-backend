import { Controller, Get, Post, Body, Param, NotFoundException, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

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
