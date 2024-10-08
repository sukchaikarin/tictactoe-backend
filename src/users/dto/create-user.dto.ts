// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty() // ฟิลด์ googleId จำเป็นต้องมี
  googleId: string;

  @IsOptional() // ฟิลด์ picture เป็น optional
  @IsString()
  picture: string;

  @IsOptional()
  @IsNumber()
  scores?: number; // ฟิลด์ scores เป็น optional

  @IsOptional()
  @IsNumber()
  highestScore?: number; // ฟิลด์ highestScore เป็น optional

  @IsOptional()
  @IsNumber()
  maxWinsStreak?: number; // ฟิลด์ maxWinsStreak เป็น optional

  @IsOptional()
  createdAt?: Date; // ฟิลด์ createdAt เป็น optional

  @IsOptional()
  updatedAt?: Date; // ฟิลด์ updatedAt เป็น optional
}
