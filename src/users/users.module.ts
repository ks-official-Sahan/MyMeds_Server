import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, FirebaseAuthGuard, FirebaseService],
})
export class UsersModule {}
