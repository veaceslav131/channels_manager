const Koa = require('koa')
const logger = require('koa-logger');

const app = new Koa();

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
  .listen(3000);
