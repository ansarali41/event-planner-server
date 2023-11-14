import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './base/dto/create-user.dto';
import { UpdateUserDto } from './base/dto/update-user.dto';
import { User } from './base/entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    try {
      const newUserDto = {
        email: email,
        password: password,
      };

      return await this.userRepository.save(newUserDto);
    } catch (error) {
      throw error;
    }
  }

  async findAllUser(body: CreateUserDto) {
    try {
      const [results, total] = await this.userRepository.findAndCount({
        where: { ...body },
      });
      return {
        results,
        total,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneUser(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new NotFoundException('User not found');

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('User not found');
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, body: UpdateUserDto) {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .update()
        .set({ ...body, updatedAt: new Date(), updatedBy: id })
        .where('id = :id', { id: id })
        .execute();
    } catch (error) {
      throw error;
    }
  }
}
