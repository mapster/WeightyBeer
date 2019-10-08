import * as http from 'http';
import Router from 'express';
import { DaoContext } from './DaoContext';
import BrewImageController from './api/BrewImageController';
import fileUpload from 'express-fileupload';
import { PubSub } from 'apollo-server';
import { ApolloServer } from 'apollo-server-express';
import { createSchema } from './api/schema/WeightyBeerSchema';

export default function(context: DaoContext, httpServer: http.Server): Router.Router {
    const router = Router();

    const pubsub = new PubSub();
    const apollo = new ApolloServer({
        context,
        schema: createSchema(pubsub),
    })
    apollo.applyMiddleware({ app: router });
    apollo.installSubscriptionHandlers(httpServer);

    const brewImageController = new BrewImageController(context.imageRepo);
    router.use('/upload', fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        createParentPath: true,
    }));
    router.post('/upload/image', (req, res) => brewImageController.postImage(req, res));
    router.get('/images/:filename', (req, res) => brewImageController.getImage(req, res));
    
    return router; 
}


