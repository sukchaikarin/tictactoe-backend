// src/users/users.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Creating a new user...'); // บันทึกข้อความ
    const createdUser = new this.userModel(createUserDto);
  
    try {
      const savedUser = await createdUser.save();
      this.logger.log(`User created: ${savedUser.id}`); // บันทึก ID ของผู้ใช้ที่ถูกสร้าง
      return savedUser;
    } catch (error) {
      this.logger.error('Error creating user', error.stack); // บันทึกข้อผิดพลาด
      throw error; // ส่งข้อผิดพลาดต่อไป
    }
  }
  

  // สามารถเพิ่มฟังก์ชันอื่น ๆ ที่เกี่ยวข้องกับผู้ใช้ได้ที่นี่
}
