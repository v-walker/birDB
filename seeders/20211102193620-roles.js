'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkInsert('roles', [
      {
      roleName: "Admin",
      createdAt: new Date(),
      updatedAt: new Date()
      },
      {
      roleName: "Basic",
      createdAt: new Date(),
      updatedAt: new Date()
      }
  ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
