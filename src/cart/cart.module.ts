import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService, FirebaseService],
})
export class CartModule {}
