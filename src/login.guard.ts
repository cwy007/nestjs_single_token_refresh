import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('user is not logged in');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      request['user'] = decoded; // Attach decoded user info to the request object

      const refreshToken = this.jwtService.sign(
        { username: decoded.username },
        { expiresIn: '7d' },
      ); // Generate a new token with a longer expiration time
      response.setHeader('token', refreshToken); // Set the token in the response header for the client to use in subsequent requests
      return true;
    } catch (err) {
      throw new UnauthorizedException('invalid token, please log in again');
    }
  }
}
