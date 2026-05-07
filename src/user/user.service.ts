import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  async login(loginUserDto: LoginUserDto) {
    // Here you would typically validate the user's credentials and generate a token
    // For demonstration purposes, we'll just return the loginUserDto
    return {
      message: 'Login successful',
      user: loginUserDto,
    };
  }
}
