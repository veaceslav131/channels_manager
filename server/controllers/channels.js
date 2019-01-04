const models = require('../models')

module.exports = (
  async function getChannels(query, count= 10, sort= 'id', sortDir= 'desc') {
    sortDir = sortDir.toUpperCase();
    sortDir = ((sortDir === 'ASC') || (sortDir === 'DESC')) ? sortDir : 'ASC';

    const channels = await models.Channel.findAll({
      limit: count,
      order: [[sort, sortDir]],
      include: [{
	model: models.Tag,
	as: 'tags',
	required: false
      }, {
	model: models.History
      }, {
	model: models.Status
      }],
      where: {
	$or: [
	  {
	    social_messengers: query
	  }, {
	    email: query
	  }, {
	    name: query
	  }, {
	    description: query
	  }, {
	    channel_name: query
	  }
	]}
    });

    return channels;
  });
