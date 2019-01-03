const bodyParser = require('koa-body')();
const models = require('../models');

module.exports = (({channelRouter}) => {
  channelRouter
    .get('/', async(ctx, next) => {
      const channels = await models.Channel.findAll({
	include: [{
	  model: models.Tag,
	  as: 'tags',
	  required: false
	}]
      });
      ctx.body = {
	channels
      };
    })
    .post('/', bodyParser, async(ctx, next) => {
      const channelData = ctx.request.body;
      if(channelData.status) {
	const check = await models.Status.checkStatus(channelData.status);
	if (check === null) {
	  ctx.throw('ERROR: Status doesn\'t exist', 500);
	}
      }

      
      if(channelData.theme_tags) {
	if(typeof(channelData.theme_tags) === 'string') {
	  const check = await models.Tag.checkTag(channelData.theme_tags);
	  if (check === null) {
	    ctx.throw('ERROR: Tag doesn\'t exist', 500);
	  }
	} else {
	  for(var i = 0; i < channelData.theme_tags.length; i++) {
	    const check = await models.Tag.checkTag(channelData.theme_tags[i]);
	    if (check === null) {
	      ctx.throw('ERROR: Tag doesn\'t exist', 500);
	    } 
	  }
	}      
      }

      const channel = await models.Channel.create(channelData);
      
      if(channelData.theme_tags) {
	if(typeof(channelData.theme_tags) === 'string') {
	  models.ChannelTag.create({'ChannelId': channel.id, 'TagId': channelData.theme_tags});
	}else{
	  for(var i = 0; i < channelData.theme_tags.length; i++) {
	    models.ChannelTag.create({'ChannelId': channel.id, 'TagId': channelData.theme_tags[i]});
	  }
	}
      }

      ctx.body = {
	channel
      };
    });
});
