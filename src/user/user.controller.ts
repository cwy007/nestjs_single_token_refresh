import {
  Controller,
  Post,
  Body,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    if (
      loginUserDto.username !== 'admin' ||
      loginUserDto.password !== 'password'
    ) {
      throw new BadRequestException('username or password is incorrect');
    }

    const token = this.jwtService.sign(
      { username: loginUserDto.username },
      { expiresIn: '7d' },
    );

    console.log('LoginUserDto:', loginUserDto);
    return token;
  }
}
