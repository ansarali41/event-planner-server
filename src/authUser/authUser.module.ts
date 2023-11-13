import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/lib/constant';
import { UsersModule } from 'src/users/users.module';
import { AuthUserController } from './authUser.controller';
import { AuthUserService } from './authUser.service';
import { UserToken } from './base/entity/user-token.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([UserToken]),
    UsersModule,
  ],
  controllers: [AuthUserController],
  providers: [AuthUserService],
  exports: [AuthUserService],
})
export class AuthUserModule {}
