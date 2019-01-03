const Koa = require('koa')
const logger = require('koa-logger');

const Router = require('koa-router');

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
  .listen(3000);
