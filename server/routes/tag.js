const bodyParser = require('koa-body')();
const models = require('../models')

module.exports = (({tagRouter}) => {
  tagRouter
    .get('/', async(ctx, next) => {
      const tags = await models.Tag.findAll();
      ctx.body = tags;
    })
    .post('/', bodyParser, async(ctx, next) => {
      const tag = await models.Tag.create({
	'is_youtube': ctx.request.body.is_youtube,
	'name': ctx.request.body.name
      });
      ctx.body = tag;
    })
    .put('/:id', bodyParser, async(ctx, next) => {
      let tag = await models.Tag.findOne({where: {id: ctx.params.id}});

      if (tag === null) {
	ctx.throw('ERROR: Tag doesn\'t exist', 500);
      }

      tag = await tag.update({
	'is_youtube': ctx.request.body.is_youtube,
	'name': ctx.request.body.name
      });
      ctx.body = tag
    })
    .delete('/:id', bodyParser, async(ctx, next) => {
      let tag = await models.Tag.findOne({where: {id: ctx.params.id}});

      if (tag === null) {
	ctx.throw('ERROR: Tag doesn\'t exist', 500);
      }

      tag = await tag.destroy();
      ctx.body = tag;
    })
});
