const Sequelize = require('sequelize');

module.exports = 
  class Tag extends Sequelize.Model{
    static init (sequelize) {
      return super.init({
	is_youtube: Sequelize.BOOLEAN,
	name: Sequelize.STRING
      }, {sequelize});
    }
    static associate (models) {
      this.belongsToMany(models.Tag, {
	through: 'ChannelTag',
	as: 'channels',
	foreignKey: 'tag_id'
      });
    }
    static checkTag(id) {
      return this.findOne({where: {id: id}});
    }
  };
