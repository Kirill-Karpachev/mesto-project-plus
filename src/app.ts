/* eslint-disable no-console */
import './env';
import * as process from 'process';
import express, { json } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import routers from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';
import { sendMessageError } from './error/error';
import UsersController from './controllers/users';
import auth from './middlewares/auth';

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

app.use(helmet());
app.use(limiter);
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.post('/signin', UsersController.login);
app.post('/signup', UsersController.createUser);

app.use(cookieParser());
app.use('/', auth, routers);

app.use(errorLogger);
app.use(sendMessageError);

async function connection() {
  try {
    await mongoose.connect(MONGO_URL);
    app.listen(PORT, () => console.log('Server started!'));
  } catch (err) {
    console.log(err);
  }
}

connection();
