import express from 'express';
import graphqlHTTP from 'express-graphql';
import Redis from 'ioredis';
import { compiledSchema } from './api/schema/WeightyBeerSchema';
import { BrewRepository } from './dao/BrewRepository';
import { RepoContext } from './RepoContext';
import { ImageRepository } from './dao/ImageRepository';
import { TapRepository } from './dao/TapRepository';

const app: express.Application = express();
const redis = new Redis();

const context: RepoContext = {
    brewRepo: new BrewRepository(redis),
    imageRepo: new ImageRepository(redis),
    tapRepo: new TapRepository(redis),
}

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

app.listen(3000, () => console.log('Example app listening on port 3000!'));