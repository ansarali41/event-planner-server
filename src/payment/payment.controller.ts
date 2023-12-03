import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/authUser/auth.guard';
import { AUTHORIZATION } from 'src/lib/constant';
import { PaymentService } from './payment.service';

@ApiTags('Payment Method')
@UseGuards(AuthGuard)
@ApiBearerAuth(AUTHORIZATION)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/:amount')
  async createPaymentIntent(@Param('amount', ParseIntPipe) amount: number) {
    const paymentIntent = await this.paymentService.createPaymentIntent(
      amount * 100,
    );
    return { clientSecret: paymentIntent.client_secret };
  }
}
