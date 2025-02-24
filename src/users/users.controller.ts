import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  // Get all users – protected route
  @UseGuards(FirebaseAuthGuard)
  @Get()
  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  // Get a single user by id – protected route
  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // Create a new user – protected route.
  @UseGuards(FirebaseAuthGuard)
  @Post()
  async createUser(
    @Body()
    createUserDto: {
      email: string;
      password: string;
      firebaseUid: string;
      name?: string;
      mobile?: string;
      address?: string;
      city?: string;
      country?: string;
      profileImage?: string;
    },
  ) {
    return this.prisma.user.create({ data: createUserDto });
  }
}
