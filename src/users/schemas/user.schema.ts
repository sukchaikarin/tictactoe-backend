// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  picture: string;
  

  @Prop({ required: true })
  googleId: string; // เพิ่ม googleId

  @Prop({ default: 0 }) // ตั้งค่าเริ่มต้นเป็น 0
  scores: number;

  @Prop({ type: Date, default: Date.now }) // ตั้งค่า createdAt
  createdAt: Date;

  @Prop({ type: Date, default: Date.now }) // ตั้งค่า updatedAt
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
