const models = require('../models')

module.exports = (
  async function getChannels(count= 10, sort= 'id', sortDir= 'desc') {
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
      }]
    });

    return channels;
  });
