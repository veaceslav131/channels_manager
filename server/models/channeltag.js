const Sequelize = require('sequelize');

module.exports = 
  class History extends Sequelize.Model{
    static init (sequelize) {
      return super.init({
	channel_id: {
	  type: Sequelize.INTEGER,
	  references: {
	    model: 'Channels',
	    key: 'id'
	  }
	},
	tag_id: {
	  type: Sequelize.INTEGER,
	  references: {
	    model: 'Tags',
	    key: 'id'
	  }
	},
      }, {sequelize});
    }
  };
