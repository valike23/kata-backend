// migrations/YYYYMMDDHHMMSS-add-nextBoutId-to-bout.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'bouts',           // your actual table name
      'nextBoutId',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'bouts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    );
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('bouts', 'nextBoutId');
  }
};
