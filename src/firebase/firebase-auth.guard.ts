import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    const parts = authHeader.split(' ');
    if (parts[0] !== 'Bearer' || !parts[1]) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const token = parts[1];

    try {
      const decodedToken = await this.firebaseService.verifyToken(token);
      // Attach the decoded token (and Firebase user info) to the request for later use.
      //console.log("Decoded TOKEN: ", decodedToken);
      request.user = decodedToken;
      return true;
    } catch (error) {
      console.log(error.message);
      if (error.code === 'auth/id-token-expired') {
        console.log('Token has expired');
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
