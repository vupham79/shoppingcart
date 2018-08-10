import express from 'express';
import middlewares from './config/middlewares';
import './config/database';
import apiRoutes from './modules';

const app = express();

middlewares(app);

apiRoutes(app);

export default app;