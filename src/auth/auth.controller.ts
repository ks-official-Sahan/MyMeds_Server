import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Request,
  Get,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('sync') // Sync endpoint: Authenticated Firebase user is saved in the backend.
  async syncUser(@Request() req) {
    const { uid, email } = req.user;
    try {
      let user = await this.prisma.user.findUnique({
        where: { firebaseUid: uid },
      });
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            firebaseUid: uid,
            email,
            password: 'firebase-auth', // Placeholder since Firebase manages authentication.
          },
        });
      }
      return { message: 'User is synced', user };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const firebaseUid = req.user.uid;
    try {
      const user = await this.prisma.user.findUnique({
        where: { firebaseUid },
      });
      //console.log(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body()
    updateData: {
      name?: string;
      mobile?: string;
      address?: string;
      city?: string;
      country?: string;
      profileImage?: string;
      location?: string;
    },
  ) {
    const firebaseUid = req.user.uid;
    try {
      const updatedUser = await this.prisma.user.update({
        where: { firebaseUid },
        data: updateData,
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
