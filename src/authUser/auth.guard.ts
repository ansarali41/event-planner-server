import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const jwtToken = request.headers['authorization'];

      if (!jwtToken) {
        throw new UnauthorizedException(
          'Authorization header is missing or token is not inserted',
        );
      }

      const payload = await this.jwtService.verifyAsync(jwtToken);

      const user = await this.usersService.findOneById(payload.user_id);

      if (!user || user.id !== payload.user_id) {
        throw new NotAcceptableException('Unauthorized User');
      }

      request['authUser'] = payload;
    } catch (e) {
      throw new UnauthorizedException(e.message || 'Unauthorized');
    }
    return true;
  }
}
