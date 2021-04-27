// Dependencies import
import express from 'express';

// Hooks import
import * as stripeWebhooks from '../webhooks/stripe';

const router = express.Router();

router.post('/stripe-webhooks', stripeWebhooks.handleStripeWebhook);

export default router;
