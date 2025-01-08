import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err, user, info, context) {
    console.log('User in JwtAuthGuard:', user);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
