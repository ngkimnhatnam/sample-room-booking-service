import { Application } from 'express';
import expressLoader from './express';

export default async ({ expressApp }: { expressApp: Application }): Promise<Application> => {
  const app = expressLoader({ app: expressApp });
  console.log('Express initialized');
  return app;
};
