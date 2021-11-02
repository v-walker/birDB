'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class birds extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  birds.init({
    commonName: DataTypes.STRING,
    scientificName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'birds',
  });
  return birds;
};