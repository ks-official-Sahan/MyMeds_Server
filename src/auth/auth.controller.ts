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

  @Post('signup')
  async signup(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    try {
      // Create user in Firebase
      const userRecord = await this.firebaseService.createUser(email, password);

      // Create user record in MongoDB (mcommerce) using Firebase UID
      const user = await this.prisma.user.create({
        data: {
          firebaseUid: userRecord.uid,
          email,
          password: 'firebase', // Placeholder, as Firebase handles auth.
        },
      });
      return {
        message: 'User created successfully',
        uid: userRecord.uid,
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  // (Optional) Endpoint to generate a custom token – useful if you need to exchange a uid for a token.
  @Post('custom-token')
  async getCustomToken(@Body() body: { uid: string }) {
    try {
      const token = await this.firebaseService.generateCustomToken(body.uid);
      return { token };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('sync') // Sync endpoint: Ensures that an authenticated Firebase user is saved in the backend.
  async syncUser(@Request() req) {
    // req.user is populated by FirebaseAuthGuard; it typically contains uid and email
    const { uid, email } = req.user;
    try {
      // Check if a user record with this Firebase UID already exists.
      let user = await this.prisma.user.findUnique({
        where: { firebaseUid: uid },
      });
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            firebaseUid: uid,
            email,
            password: 'firebase', // Placeholder since Firebase manages authentication.
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

  // Update profile endpoint (existing)
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
