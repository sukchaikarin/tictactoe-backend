// src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtAuthService } from './jwt.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly jwtAuthService: JwtAuthService) {}
  @Get('hello') // Define the Hello World endpoint
  helloWorld() {
    return 'Hello World'; // Return the Hello World message
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: Request) {
    // Initiates the Google authentication process
  }

  @Get('google/callback')
@UseGuards(AuthGuard('google'))
googleLoginCallback(@Req() req: Request, @Res() res: Response) {
  // Handle the callback from Google, where user info is available
  // @ts-ignore
  const user = req.user;

  //console.log('User information from Google:', user);

  const token = this.jwtAuthService.createToken(user._id.toString());
  console.log("🚀 ~ AuthController ~ googleLoginCallback ~ token:", token)

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieMaxAge = parseInt(process.env.COOKIE_MAX_AGE, 10) || 7 * 24 * 60 * 60 * 1000;
  
 const thisIsCookie =  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true, // ใช้การตรวจสอบ NODE_ENV ที่กำหนด
    maxAge: cookieMaxAge,
    sameSite: "none",
  });
 console.log("🚀 ~ AuthController ~ googleLoginCallback ~ thisIsCookie:", thisIsCookie)

 return res.redirect('your-frontend-url'); 
}


}
