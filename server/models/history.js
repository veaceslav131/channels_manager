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
	from: Sequelize.STRING,
	message: Sequelize.STRING
      }, {sequelize});
    }
    static associate (models) {
      this.belongsTo(models.Channel, {
	foreignKey: 'channel_id'
      })
    }
  };
