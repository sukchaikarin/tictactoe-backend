// src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
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

  // Log the user information to the console
  console.log('User information from Google:', user);

  // Optionally, you can also log it using a logger if you have one set up
  // this.logger.log('User information from Google:', user);

  // Redirect to your frontend application
  return res.redirect('your-frontend-url'); // Replace with your actual frontend URL
}

}
