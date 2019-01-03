const Sequelize = require('sequelize');

module.exports = 
  class History extends Sequelize.Model{
    static init (sequelize) {
      return super.init({
	channel_id: Sequelize.INTEGER,
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
