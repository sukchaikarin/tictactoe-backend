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
    // @ts-ignore
    const user = req.user;
    console.log("🚀 ~ AuthController ~ googleLoginCallback ~ user:", user);
  
    const token = this.jwtAuthService.createToken(user._id.toString());
    console.log("🚀 ~ AuthController ~ googleLoginCallback ~ token:", token);
  
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieMaxAge = parseInt(process.env.COOKIE_MAX_AGE, 10) || 7 * 24 * 60 * 60 * 1000;
  
    // Set JWT in cookies
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProduction, // Secure only in production
      maxAge: cookieMaxAge,
      sameSite: isProduction ? "none" : "lax", // Adjust for production environment
    });
  
    // Define the redirect URL based on the environment
    const redirectUrl = isProduction
      ? 'https://yourdomain.com/play' // Production URL
      : 'http://localhost:3000/play'; // Development URL
  
    console.log("🚀 ~ AuthController ~ googleLoginCallback ~ Redirecting to:", redirectUrl);
  
    return res.redirect(redirectUrl); // Redirect to the frontend
  }


}
