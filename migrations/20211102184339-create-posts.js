'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      commonName: {
        type: Sequelize.STRING
      },
      scientificName: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      precipitation: {
        type: Sequelize.STRING
      },
      temperature: {
        type: Sequelize.STRING
      },
      cloudCover: {
        type: Sequelize.STRING
      },
      observation: {
        type: Sequelize.STRING
      },
      likes: {
        type: Sequelize.INTEGER
      },
      comments: {
        type: Sequelize.STRING
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('posts');
  }
};