import {Body, Controller, Get, Param, Post, Redirect, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UserResponseLoginInterface} from './types/user-response-login.interface';
import {LoginUserDto} from './dto/login-user.dto';
import {EncUser} from './decorators/user.decorator';
import {AuthGuard} from './guards/auth.guard';
import {AdminGuard} from './guards/admin.guard';

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
  ) {
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body('user') createUserDto: CreateUserDto): Promise<{ message: string }> {
    await this.authService.register(createUserDto);
    return {message: 'Пользователь успешно создан'};
  }

  @Get('activate/:link')
  @Redirect('https://yandex.ru', 302)
  async activate(@Param('link') activationLink: string): Promise<{ message: string }> {
    await this.authService.activate(activationLink);
    return {message: 'Успех'};
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseLoginInterface> {
    const user = await this.authService.login(loginUserDto);
    return this.authService.buildUserResponseForLogin(user);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@EncUser('idNumber') userId: number) {
    const user = await this.authService.getMe(userId);
    return this.authService.buildUserResponse(user);
  }
}
