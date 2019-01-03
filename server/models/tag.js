const Sequelize = require('sequelize');

module.exports = 
  class Tag extends Sequelize.Model{
    static init (sequelize) {
      return super.init({
	is_youtube: Sequelize.BOOLEAN,
	name: Sequelize.STRING
      }, {
	sequelize
      });
    }
    static associate (models) {
      this.belongsToMany(models.Channel, {
	through: 'ChannelTag',
	as: 'channels',
	foreignKey: 'TagId'
      });
    }
    static checkTag(id) {
      return this.findOne({where: {id: id}});
    }
  };
