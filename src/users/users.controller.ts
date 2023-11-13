import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './base/dto/create-user.dto';
import { UpdateUserDto } from './base/dto/update-user.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AUTHORIZATION } from 'src/lib/constant';

@ApiTags('Users')
@ApiBearerAuth(AUTHORIZATION)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('findAll')
  async findAllUser(@Body() body: CreateUserDto) {
    try {
      const { results, total } = await this.usersService.findAllUser(body);
      return {
        statusCode: HttpStatus.OK,
        message: 'Success',
        data: results,
        count: total,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':email')
  async findOneUser(@Param('email') email: string) {
    try {
      return await this.usersService.findOneUser(email);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.usersService.updateUser(+id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   try {
  //     return await this.usersService.remove(+id);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
