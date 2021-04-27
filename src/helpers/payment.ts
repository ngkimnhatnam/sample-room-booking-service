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

/**
 * Helper function - Construct Stripe webhook event
 *
 * Return a promise with Stripe event object
 * @param requestRawBody - Request raw body
 * @param stripeSignature - Stripe signature from request headers
 */
//@ts-ignore
export const webhooks = (requestRawBody: any, stripeSignature: any): Promise<Stripe.Event> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(stripe.webhooks.constructEvent(requestRawBody, stripeSignature, paymentConfig.stripe_webhook_secret));
    } catch (error) {
      eventBus.emit('stripe-webhooks-error', error);
      reject(error);
    }
  });
};
