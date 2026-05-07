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

      // If the token expires in less than 1 day (86400 seconds), generate a new one
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp - now < 24 * 60 * 60) {
        const newToken = this.jwtService.sign(
          { username: decoded.username },
          { expiresIn: '7d' },
        ); // Generate a new token with a longer expiration time
        response.setHeader('token', newToken); // Set the token in the response header for the client to use in subsequent requests
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException('invalid token, please log in again');
    }
  }
}
