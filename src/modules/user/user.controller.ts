/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { User as UserModel } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);


@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  
  @Post('login')
  async login(@Body('token') token): Promise<UserModel> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload();
    const data = await this.userService.login({
      email: payload.email,
      name: payload.name,
      image: payload.picture
    })
    return data
  }
}