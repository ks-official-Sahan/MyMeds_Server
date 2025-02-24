import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [PrismaModule],
  providers: [CartService, FirebaseAuthGuard, FirebaseService],
  controllers: [CartController],
})
export class CartModule {}
