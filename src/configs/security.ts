import dotenv from 'dotenv';
dotenv.config();

const securityConfig = {
  jwt_token_secret: process.env.JWT_TOKEN_SECRET!,
  jwt_token_life_in_seconds: process.env.JWT_TOKEN_LIFE_SECS,
  jwt_options: {
    issuer: 'Nam Nguyen',
    subject: 'Booking App',
    audience: 'Booking App',
    expiresIn: process.env.JWT_TOKEN_LIFE,
  },
  hash_salt: process.env.MY_HASH_SALT!,
  iterations: Number(process.env.MY_HASH_ITERATIONS),
  hash_length: Number(process.env.MY_HASH_LENGTH),
  hash_digest: process.env.MY_HASH_DIGEST!,
};

export default securityConfig;
