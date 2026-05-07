import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    console.log('LoginUserDto:', loginUserDto);
    return this.userService.login(loginUserDto);
  }
}
