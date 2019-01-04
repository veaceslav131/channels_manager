const bodyParser = require('koa-body')();
const models = require('../models');
const cacheManager = require('cache-manager');
const redisStore = require('cache-manager-redis-store');

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

async function chaeckThemesTag(theme_tags) {
  if(typeof(theme_tags) === 'string') {
    const tag = await models.Tag.checkTag(theme_tags);
    if (tag === null) {
      return false;
    }
  } else {
    for(var i = 0; i < theme_tags.length; i++) {
      const tag = await models.Tag.checkTag(theme_tags[i]);
      if (tag === null) {
	return false;
      } 
    }
  }
  return true;
}

module.exports = (({channelRouter}) => {
  channelRouter
    .get('/', async(ctx, next) => {
      const channels = await redisCache.wrap('channels', function() {
	models.Channel.findAll({
	  include: [{
	    model: models.Tag,
	    as: 'tags',
	    required: false
	  }]
	});
      });
      ctx.body = channels;
    })
    .post('/', bodyParser, async(ctx, next) => {
      const channelData = ctx.request.body;

      //check if status exist
      if(channelData.status) {
	const status = await models.Status.checkStatus(channelData.status);
	if (status === null) {
	  ctx.throw('ERROR: Status doesn\'t exist', 500);
	}
      }
      
      //check if tags exist
      if((channelData.theme_tags)&&(!checkThemesTag(channelData.theme_tags))) {
	ctx.throw('ERROR: Tag doesn\'t exist', 500);
      }

      const channel = await models.Channel.create(channelData);
      
      //create records in join table ChannelTag
      if(channelData.theme_tags) {
	if(typeof(channelData.theme_tags) === 'string') {
	  models.ChannelTag.create({'ChannelId': channel.id, 'TagId': channelData.theme_tags});
	}else{
	  for(var i = 0; i < channelData.theme_tags.length; i++) {
	    models.ChannelTag.create({'ChannelId': channel.id, 'TagId': channelData.theme_tags[i]});
	  }
	}
      }

      ctx.body = channel;
    })
    .put('/:id', bodyParser, async(ctx, next) => {
      let channel = await models.Channel.findOne({where: {id: ctx.params.id}});

      if (channel === null) {
	ctx.throw('ERROR: Channel doesn\'t exist', 500);
      }

      //check if tags exist
      if((ctx.request.body.theme_tags)&&(checkThemesTag(ctx.request.body.theme_tags))) {
	ctx.throw('ERROR: Tag doesn\'t exist', 500);
      }

      channel = await channel.update(ctx.request.body);
      
      //create records in join table ChannelTag
      if(ctx.request.body.theme_tags) {
	if(typeof(ctx.request.body.theme_tags) === 'string') {
	  models.ChannelTag.create({'ChannelId': channel.id, 'TagId': ctx.request.body.theme_tags});
	}else{
	  for(var i = 0; i < ctx.request.body.theme_tags.length; i++) {
	    models.ChannelTag.create({'ChannelId': channel.id, 'TagId': ctx.request.body.theme_tags[i]});
	  }
	}
      }
      ctx.body = channel;
    })
    .delete('/:id', bodyParser, async(ctx, next) => {
      let channel = await models.Channel.findOne({where: {id: ctx.params.id}});

      if (channel === null) {
	ctx.throw('ERROR: Channel doesn\'t exist', 500);
      }

      channel = await channel.destroy();
      ctx.body = channel;
    })
    .get('/:id/history', bodyParser, async(ctx, next) => {
      const history = await models.History.findAll({where: {channel_id: ctx.params.id}});
      ctx.body = history;
    })
    .post('/:id/history', bodyParser, async(ctx, next) => {
      const channel = await models.Channel.checkChannel(ctx.params.id);

      if(channel === null) { //check if channel exist
	ctx.throw('ERROR: Channel doesn\'t exist', 500);
      } else {
	const history = await models.History.create(ctx.request.body);
	ctx.body = history;
      }
    })
    .put('/:id/history/:hid', bodyParser, async(ctx, next) => {
      let channel = await models.Channel.checkChannel(ctx.params.id);

      if(channel === null) { //check if channel exist
	ctx.throw('ERROR: Channel doesn\'t exist', 500);
      } else {
	let history = await models.History.findOne(ctx.params.hid);
	history = history.update(ctx.request.body);
	ctx.body = history;
      }
    })
    .delete('/:id/history/:hid', bodyParser, async(ctx, next) => {
      let history = await models.History.findOne({where: {id: ctx.params.hid}});

      if (history === null) {
	ctx.throw('ERROR: History doesn\'t exist', 500);
      }

      history = await history.destroy();
      ctx.body = history;      
    });
});
