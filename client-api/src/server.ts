import express from 'express';
import graphqlHTTP from 'express-graphql';
import Redis from 'ioredis';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { compiledSchema } from './api/schema/WeightyBeerSchema';
import { BrewRepository } from './dao/BrewRepository';
import { RepoContext } from './RepoContext';
import { ImageRepository } from './dao/ImageRepository';
import { TapRepository } from './dao/TapRepository';
import { WeightRepository } from './dao/WeightRepository';
import BrewImageController from './api/BrewImageController';

const REDIS_HOST = process.env.WEIGHTYBEER_REDIS || 'localhost';
const BREW_IMAGE_PATH = process.env.WEIGHTYBEER_BREW_IMAGE_PATH || '/tmp/brew-images/';

const app: express.Application = express();
const redis = new Redis({ host: REDIS_HOST });

const context: RepoContext = {
    brewRepo: new BrewRepository(redis),
    imageRepo: new ImageRepository(redis, BREW_IMAGE_PATH),
    tapRepo: new TapRepository(redis),
    weightRepo: new WeightRepository(redis),
}

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema: compiledSchema,
    graphiql: true,
    context,
    customFormatErrorFn: error => ({
        message: error.message,
        locations: error.locations,
        stack: error.stack ? error.stack.split('\n') : [],
        path: error.path
    })
}));

const brewImageController = new BrewImageController(context.imageRepo);
app.use('/upload', fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    createParentPath: true,
}));
app.post('/upload/image', (req, res) => brewImageController.postImage(req, res));
app.get('/images/:filename', (req, res) => brewImageController.getImage(req, res));

app.listen(3000, () => console.log('WeightyBeer GraphQL API running on port 3000'));