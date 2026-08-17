'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Enable uuid-ossp extension for UUID generation
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  },
  down: async (queryInterface, Sequelize) => {
    // No need to drop extension
  },
};
