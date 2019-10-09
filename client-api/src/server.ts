import express from 'express';
import Redis from 'ioredis';
import cors from 'cors';
import { BrewRepository } from './dao/BrewRepository';
import { DaoContext } from './DaoContext';
import { ImageRepository } from './dao/ImageRepository';
import { TapRepository } from './dao/TapRepository';
import { WeightRepository } from './dao/WeightRepository';
import { ActionPublisher } from './dao/ActionPublisher';
import router from './router';

const REDIS_HOST = process.env.WEIGHTYBEER_REDIS || 'localhost';
const BREW_IMAGE_PATH = process.env.WEIGHTYBEER_BREW_IMAGE_PATH || '/tmp/brew-images/';
const ACTION_CHANNEL = process.env.WEIGHTYBEER_ACTION_CHANNEL || 'actions';

const app: express.Application = express();
const redis = new Redis({ host: REDIS_HOST });

const context: DaoContext = {
    brewRepo: new BrewRepository(redis),
    imageRepo: new ImageRepository(redis, BREW_IMAGE_PATH),
    tapRepo: new TapRepository(redis),
    weightRepo: new WeightRepository(redis),
    actionPublisher: new ActionPublisher(redis, ACTION_CHANNEL),
}

app.use(cors());
app.use('/api', router(context));
app.listen(3000, () => console.log('WeightyBeer GraphQL API running on port 3000'));

