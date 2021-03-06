const Sequelize = require('sequelize');

module.exports = 
  class Status extends Sequelize.Model{
    static init (sequelize) {
      return super.init({
	name: Sequelize.STRING
      }, {sequelize});
    }
    static checkStatus(id) {
      return this.findOne({where: {id: id}});
    }
  };
