'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        type: Sequelize.INTEGER
      },
      nama_user: {
        type: Sequelize.STRING
      },
      foto: {
        type: Sequelize.TEXT
      },
      deskripsi: {
        type: Sequelize.TEXT
      },
      password: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM("admin","resepsionis")
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};