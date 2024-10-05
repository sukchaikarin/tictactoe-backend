// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class JwtAuthService {
//   constructor(private readonly jwtService: JwtService) {}

//   createToken(userId: string) {
//     return this.jwtService.sign({ userId });
//   }
// }
// import { Injectable } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';

// @Injectable()
// export class JwtAuthService {
//   // กำหนด secret key สำหรับการ sign token
//   private readonly jwtSecret = process.env.JWT_SECRET;

//   createToken(userId: string) {
//     return jwt.sign({ userId }, this.jwtSecret, {
//       expiresIn: process.env.JWT_EXPIRES_IN || '1h', // ใช้ค่าเวลาหมดอายุจาก environment variable
//     });
//   }
// }

import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthService {
  // กำหนด secret key สำหรับการ sign token
  private readonly jwtSecret = process.env.JWT_SECRET;

  // ฟังก์ชันในการสร้าง token โดยใช้ userId
  createToken(userId: string) {
    const payload = {
      user: {
        id: userId, // ใช้ _id ของผู้ใช้
      },
    };

    // สร้าง JWT token โดยมีอายุ 10 วัน
    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '10d' });
    return token;
  }
}
