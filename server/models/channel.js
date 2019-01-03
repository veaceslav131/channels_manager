const Sequelize = require('sequelize');

module.exports = 
  class Channel extends Sequelize.Model{
    static init (sequelize) {
      return super.init({
	channel_link: {
	  type: Sequelize.STRING,
	  allowNull: false
	},
	channel_name: {
	  type: Sequelize.STRING,
	  allowNull: false
	},
	status: Sequelize.INTEGER,
	name: Sequelize.STRING,
	email:  {
	  type: Sequelize.STRING,
	  validate: {
	    isEmail: true
	  }
	},
	social_messengers: Sequelize.STRING,
	prices: Sequelize.STRING,
	description: Sequelize.TEXT
      }, {sequelize});
    }
    static associate(models) {
      this.belongsToMany(models.Tag, {
	through: 'ChannelTag',
	as: 'tags',
	foreignKey: 'channel_id'
      });
      this.belongsTo(models.Status, {
	foreignKey: 'status_id'
	as: 'status'
      });
    }
  };
