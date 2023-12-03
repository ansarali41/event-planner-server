import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly account: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly amount: number;
}
