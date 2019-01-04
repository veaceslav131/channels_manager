const models = require('../models')

module.exports = (
  async function getChannels(count= 10, page=1, sort= 'id', sortDir= 'desc', query, status) {
    let conditions = {
      limit: count,
      offset: page,
      order: [[sort, sortDir]],
      include: [{
	model: models.Tag,
	as: 'tags',
	required: false
      }, {
	model: models.History
      }, {
	model: models.Status
      }]
    }
    let where = {};
    sortDir = sortDir.toUpperCase();
    sortDir = ((sortDir === 'ASC') || (sortDir === 'DESC')) ? sortDir : 'ASC';
    count = (count>=10) && (count<=100) ? count : ((count < 10) ? 10 : 100);
    page = (page === '1') ? 0 : page*count;

    if(typeof status !== 'undefined') { where.status = status }
    if(typeof query !== 'undefined') {
      where.$or = [
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
	];
    }
    
    if(Object.keys(where).length) {
      conditions.where = where;
    }


    const channels = await models.Channel.findAll(conditions);

    return channels;
  });
