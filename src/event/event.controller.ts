import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/authUser/auth.guard';
import { AUTHORIZATION } from 'src/lib/constant';
import { CreateEventDto } from './base/dto/create-event.dto';
import { UpdateEventDto } from './base/dto/update-event.dto';
import { EventService } from './event.service';
import { Event } from './base/entity/event.entity';

@ApiTags('Event Management')
@UseGuards(AuthGuard)
@ApiBearerAuth(AUTHORIZATION)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() body: CreateEventDto, @Req() request: Request) {
    try {
      const userId = request['authUser'].user_id;

      const event = await this.eventService.createEvent(body, userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Success',
        data: event,
      };
    } catch (error) {
      throw error;
    }
  }
  @Post('findAll')
  async findAllEvents(@Body() body: Event, @Req() request: Request) {
    try {
      const userId = request['authUser'].user_id;
      const { results, total } = await this.eventService.findAllEvent(
        body,
        userId,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Success',
        count: total,
        data: results,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOneUser(@Param('id') id: number, @Req() request: Request) {
    try {
      const userId = request['authUser'].user_id;
      return await this.eventService.findOneEvent(id, userId);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
    @Req() request: Request,
  ) {
    try {
      const userId = request['authUser'].user_id;
      const res = this.eventService.updateEvent(+id, updateEventDto, userId);
      if ((await res).affected > 0) {
        return {
          statusCode: HttpStatus.ACCEPTED,
          message: 'updated successfully',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request: Request) {
    try {
      const userId = request['authUser'].user_id;
      const EventRes = await this.eventService.remove(+id, userId);
      if (EventRes.affected > 0) {
        return { statusCode: HttpStatus.OK, message: 'Deleted successfully' };
      }
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Deleted unsuccessfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
