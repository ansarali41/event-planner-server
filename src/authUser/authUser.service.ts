import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/base/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { UserLoginDto } from './base/dto/user-login.dto';
import { UserToken } from './base/entity/user-token.entity';

@Injectable()
export class AuthUserService {
  constructor(
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    try {
      if (createUserDto.password !== createUserDto.confirm_password) {
        throw new BadRequestException('Password not matched');
      }
      const hashed = await bcrypt.hash(createUserDto.password, 12);

      await this.usersService.createUser(createUserDto.email, hashed);

      return {
        statusCode: 201,
        message: 'Registration successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async login(userLoginDto: UserLoginDto) {
    try {
      const user = await this.usersService.findOneUser(userLoginDto.email);

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      if (!(await bcrypt.compare(userLoginDto.password, user.password))) {
        throw new BadRequestException('Password not matched!');
      }

      const jwt = await this.jwtService.signAsync({
        user_id: user.id,
        email: user.email,
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      await this.userTokenRepository.save({
        user_id: user.id,
        token: jwt,
        created_at: new Date(),
        expired_at: tomorrow,
      });
      return jwt;
    } catch (error) {
      throw error;
    }
  }

  async logout(jwtToken: string) {
    try {
      const { user_id } = await this.jwtService.verifyAsync(jwtToken);

      return await this.userTokenRepository.delete({
        user_id: user_id,
      });
    } catch (error) {
      throw error;
    }
  }

  async signIn(email, pass) {
    const user = await this.usersService.findOneUser(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException('Unauthorized');
    }
    const payload = { user_id: user.id, email: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // async updateUser(id: number, body: UpdateUserDto) {
  //   try {
  //     return await this.userRepository
  //       .createQueryBuilder()
  //       .update()
  //       .set({ ...body, updatedAt: new Date(), updatedBy: id })
  //       .where('id = :id', { id: id })
  //       .execute();
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
