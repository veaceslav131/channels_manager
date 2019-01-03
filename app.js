const Koa = require('koa')
const logger = require('koa-logger');
const Router = require('koa-router');
const bodyParser = require('koa-body')();
const cacheManager = require('cache-manager');
const redisStore = require('cache-manager-redis-store');
const mount = require('koa-mount');
const jwt = require('koa-jwt');

//Cache initialize

const redisCache = cacheManager.caching({
  store: redisStore,
  db:0,
  ttl:0,
});

// listen for redis connection error event
var redisClient = redisCache.store.getClient();

redisClient.on('error', (error) => {
  // handle error here
  console.log(error);
});

const ttl = 5;

//Channels controller
const getChannels = require('./server/controllers/channels');

const channels = new Koa();

const channelsRouter = new Router();
channelsRouter.get('/', bodyParser, async ctx => {
  let channels = await redisCache.wrap('channels', function() {
    return getChannels(ctx.query.count, ctx.query.sort, ctx.query.sortDir);
  });
  ctx.body = channels;
});

channels.use(channelsRouter.routes())

//Main app
const app = new Koa();

const statusRouter = new Router({
  prefix: '/statuses'
});
const tagRouter = new Router({
  prefix: '/theme_tags'
})
const channelRouter = new Router({
  prefix: '/channel'
})

require('./server/routes/status')({statusRouter});
require('./server/routes/tag')({tagRouter});
require('./server/routes/channel')({channelRouter});



app
  .use(logger())
//  .use(jwt({secret: 'super-secret'}))
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  })
  .use(statusRouter.routes())
  .use(tagRouter.routes())
  .use(channelRouter.routes())
  .use(mount(channels))
  .listen(3000);
