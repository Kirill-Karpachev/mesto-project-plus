/* eslint-disable no-console */
import './env';
import * as process from 'process';
import express, { json } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import routers from './routes';
import tmpAuth from './tmp';
import { sendMessageError } from './error/error';

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
app.use(tmpAuth);

app.use('/', routers);
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
