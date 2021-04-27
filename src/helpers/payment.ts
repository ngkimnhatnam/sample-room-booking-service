// Dependencies import
import Stripe from 'stripe';

// Configs import
import paymentConfig from '../configs/payment';

// EventBus import
import eventBus from '../subscriptions/eventEmitter';

const stripe = new Stripe(paymentConfig.stripe_secret_key, {
  // @ts-ignore
  apiVersion: paymentConfig.api_version,
});

export const payRoomBooking = async (
  amount: number,
  stripe_id: string,
): Promise<Stripe.Response<Stripe.PaymentIntent>> => {
  try {
    return await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
      customer: stripe_id,
      confirm: true,
    });
  } catch (err) {
    eventBus.emit('stripe-error', err);
    throw err;
  }
};
