import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe;
  constructor() {
    this.stripe = new Stripe(process.env.SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(amount: number) {
    // Use the Stripe API to create a payment intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    return paymentIntent;
  }
}
