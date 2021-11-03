'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.users.belongsTo(models.roles, {foreignKey: 'roleName'})
      models.users.hasMany(models.posts, {foreignKey: 'userID'})
      models.users.hasMany(models.comments, {foreignKey: 'username'})
    }
  };
  users.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    roleName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};