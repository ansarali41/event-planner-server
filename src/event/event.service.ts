import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateEventDto } from './base/dto/create-event.dto';
import { UpdateEventDto } from './base/dto/update-event.dto';
import { Event } from './base/entity/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async createEvent(
    createEventDto: CreateEventDto,
    userId: number,
  ): Promise<Event> {
    try {
      return await this.eventRepository.save({
        ...createEventDto,
        user_id: userId,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllEvent(body: Event, userId) {
    try {
      const [results, total] = await this.eventRepository.findAndCount({
        where: { ...body, user_id: userId },
        take: 10,
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        results,
        total,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllPublicEvent(body: Event, userId: number) {
    try {
      const [results, total] = await this.eventRepository.findAndCount({
        where: { ...body, user_id: Not(userId) },
        take: 10,
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        results,
        total,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneEvent(id: number, userId: number): Promise<Event> {
    try {
      const event = await this.eventRepository.findOne({
        where: { id, user_id: userId },
      });
      if (!event) throw new NotFoundException('Event not found');

      return event;
    } catch (error) {
      throw error;
    }
  }

  async findOnePublicEvent(id: number): Promise<Event> {
    try {
      const event = await this.eventRepository.findOne({
        where: { id },
      });
      if (!event) throw new NotFoundException('Event not found');

      return event;
    } catch (error) {
      throw error;
    }
  }

  async updateEvent(id: number, body: UpdateEventDto, userId) {
    try {
      await this.findOneEvent(id, userId);

      return await this.eventRepository
        .createQueryBuilder()
        .update()
        .set({ ...body, updatedAt: new Date(), updatedBy: userId })
        .where('id = :id', { id: id })
        .execute();
    } catch (error) {
      throw error;
    }
  }
  async remove(id: number, userId) {
    try {
      await this.findOneEvent(id, userId);

      return await this.eventRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id: id })
        .andWhere('user_id = :user_id', { user_id: userId })
        .execute();
    } catch (error) {
      throw error;
    }
  }
}
