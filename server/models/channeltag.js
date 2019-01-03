const Sequelize = require('sequelize');

module.exports = 
  class ChannelTag extends Sequelize.Model{
    static init (sequelize) {
      return super.init({
	ChannelId: {
	  type: Sequelize.INTEGER,
	  references: {
	    model: 'Channels',
	    key: 'id'
	  }
	},
	TagId: {
	  type: Sequelize.INTEGER,
	  references: {
	    model: 'Tags',
	    key: 'id'
	  }
	},
      }, {
	sequelize
      });
    }
  };
