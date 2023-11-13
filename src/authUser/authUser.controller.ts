import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AUTHORIZATION } from 'src/lib/constant';
import { CreateUserDto } from 'src/users/base/dto/create-user.dto';
import { AuthGuard } from './auth.guard';
import { AuthUserService } from './authUser.service';
import { UserLoginDto } from './base/dto/user-login.dto';

@ApiTags('Auth User')
@ApiBearerAuth(AUTHORIZATION)
@Controller('auth-user')
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authUserService.registerUser(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const jwt = await this.authUserService.login(userLoginDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successfully',
      jwt,
    };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() request: Request) {
    const jwtToken = request.headers['authorization'];

    await this.authUserService.logout(jwtToken);
    return {
      statusCode: 200,
      message: 'Logged out successfully',
    };
  }
}
