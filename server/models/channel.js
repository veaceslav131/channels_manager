'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    channel_link: DataTypes.STRING,
    channel_name: DataTypes.STRING,
    theme_tags: DataTypes.ARRAY,
    status: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    social_messengers: DataTypes.STRING,
    prices: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  Channel.associate = function(models) {
    // associations can be defined here
  };
  return Channel;
};