import dotenv from 'dotenv';
dotenv.config();

const paymentConfig = {
  stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
  api_version: process.env.API_VERSION!,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
};

export default paymentConfig;
