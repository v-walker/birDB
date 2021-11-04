'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.comments.belongsTo(models.posts, {foreignKey: 'id'})
      models.comments.belongsTo(models.users, {foreignKey: 'username'})
    }
  };
  comments.init({
    postID: DataTypes.INTEGER,
    username: DataTypes.STRING,
    contents: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'comments',
  });
  return comments;
};