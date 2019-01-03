const bodyParser = require('koa-body')();
const models = require('../models')

module.exports = (({statusRouter}) => {
  statusRouter
  .get('/', async(ctx, next) => {
    const statuses = await models.Status.findAll();
    ctx.body = {
      statuses
    };
  })
  .post('/', bodyParser, async(ctx,next) => {
    const status = await models.Status.create({'name': ctx.request.body.name});
    ctx.body = {
      status
    };
  })
  .delete('/:id', bodyParser, async(ctx, next) => {
    let status = await models.Status.findOne({where: {id: ctx.params.id}});
    status = await status.destroy();
    ctx.body = {
      status
    };
  })
});
