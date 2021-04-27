// Dependencies import
import { Request, Response } from 'express';

// Event bus import
import eventBus from '../subscriptions/eventEmitter';

// Helpers import
import * as paymentHelper from '../helpers/payment';

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    //@ts-ignore
    event = await paymentHelper.webhooks(req['rawBody'], sig);
    switch (event.type) {
      //------------------------------------------Event payment for a room booking succeeded-----------------------------------------
      case 'payment_intent.succeeded':
        eventBus.emit('send-confirm-email');
        break;

      default:
        // Unexpected event type
        return res.status(400).end();
    }
    res.send({ received: true });
  } catch (err) {
    console.error(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
