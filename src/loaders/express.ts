// Dependencies import
import express from 'express';
import { Request, Response, NextFunction, Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Configs import
import swaggerDefinition from '../configs/swagger';

// Routes import
import userRoutes from '../routes/user';
import authRoutes from '../routes/authentication';

const ExpressLoaders = ({ app }: { app: Application }): Application => {
  app.use(express.urlencoded({ extended: true }));

  //@ts-ignore
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    next();
  });

  const swaggerOptions = {
    swaggerDefinition,
    apis: ['./dist/routes/*.js'],
  };
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(express.json({ limit: '10kb' }));

  app.use('/api/v1', userRoutes);
  app.use('/api/v1', authRoutes);

  return app;
};

export default ExpressLoaders;
