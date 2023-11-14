import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/base/entity/user.entity';
import { UsersModule } from './users/users.module';
import { AuthUserModule } from './authUser/authUser.module';
import { UserToken } from './authUser/base/entity/user-token.entity';
import { EventModule } from './event/event.module';
import { Event } from './event/base/entity/event.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, UserToken, Event],
      synchronize: true,
    }),
    UsersModule,
    AuthUserModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
