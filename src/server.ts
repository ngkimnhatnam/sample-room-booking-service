import express from 'express';
import loaders from './loaders/index';

const port = process.env.PORT || 3000;

const startServer = async () => {
  const application = express();

  const app = await loaders({ expressApp: application });

  app.listen(port)
};

startServer();
