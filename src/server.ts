import Koa from 'koa';
import Router from 'koa-router';
import json from 'koa-json';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser'
import { MongoDBService } from './services/mongodb.service';


const mongoDBService = new MongoDBService();
const server = new Koa();
const router = new Router();

router.get('/', async (ctx, next) => {
    ctx.body = {msg: 'Hello World!' }
;

await next();
})

function escapeRegex(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get('/reviews', async (ctx, next) => {
    const limit = parseInt(ctx.query.limit);
    const skip = parseInt(ctx.query.skip);
    let search = ctx.query.search;
    console.log(search)
    // if(search){
    //     search = new RegExp(escapeRegex(ctx.query.search), 'gi')
    //     ctx.body = await mongoDBService.getReviews(limit, skip, {artist: search});
    // } else {
    //     ctx.body = await mongoDBService.getReviews(20, skip);
    // }
;

await next();
})

router.post('/reviews2', async (ctx, next) => {
    const limit = parseInt(ctx.request.body.limit);
    const skip = parseInt(ctx.request.body.skip);
    let search = ctx.request.body.search;
    if(search){
        search = new RegExp(escapeRegex(ctx.query.search), 'gi')
        ctx.body = await mongoDBService.getReviews(limit, skip, {artist: search});
    } else {
        ctx.body = await mongoDBService.getReviews(20, skip);
    }
;

await next();
})

server.use(bodyParser());
server.use(cors());
server.use(json());

server.use(router.routes()).use(router.allowedMethods());

server.listen(3000, () => {
    console.log('Koa started');
    mongoDBService.connectDB();
})

export default server;