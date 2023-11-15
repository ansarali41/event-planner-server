import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly budget: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly date: string;

  @ApiProperty()
  @IsNotEmpty()
  location: string;
}
