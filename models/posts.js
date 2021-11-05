'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.posts.belongsTo(models.users, {foreignKey: 'id'})
      models.posts.hasMany(models.comments, {foreignKey: 'postID'})
    }
  };
  posts.init({
    title: DataTypes.STRING,
    commonName: DataTypes.STRING,
    scientificName: DataTypes.STRING,
    location: DataTypes.STRING,
    precipitation: DataTypes.STRING,
    temperature: DataTypes.STRING,
    cloudCover: DataTypes.STRING,
    observation: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
    imgURL: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'posts',
  });
  return posts;
};