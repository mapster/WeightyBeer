import Router from 'express';
import graphqlHTTP from 'express-graphql';
import { compiledSchema } from './api/schema/WeightyBeerSchema';
import { DaoContext } from './DaoContext';
import BrewImageController from './api/BrewImageController';
import fileUpload from 'express-fileupload';

export default function(context: DaoContext): Router.Router {
    const router = Router();

    router.use('/graphql', graphqlHTTP({
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
    router.use('/upload', fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        createParentPath: true,
    }));
    router.post('/upload/image', (req, res) => brewImageController.postImage(req, res));
    router.get('/images/:filename', (req, res) => brewImageController.getImage(req, res));
    
    return router; 
}
