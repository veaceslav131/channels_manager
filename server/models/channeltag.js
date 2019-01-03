'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChannelTag = sequelize.define('ChannelTag', {
    channel_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER
  }, {});
  ChannelTag.associate = function(models) {
    // associations can be defined here
  };
  return ChannelTag;
};