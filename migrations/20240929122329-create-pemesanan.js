'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pemesanans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_pemesanan: {
        type: Sequelize.INTEGER
      },
      nomer_pemesanan: {
        type: Sequelize.INTEGER
      },
      nama_pemesan: {
        type: Sequelize.STRING
      },
      email_pemesan: {
        type: Sequelize.STRING
      },
      tgl_pemesanan: {
        type: Sequelize.STRING
      },
      tgl_check_in: {
        type: Sequelize.STRING
      },
      tgl_check_out: {
        type: Sequelize.STRING
      },
      nama_tamu: {
        type: Sequelize.STRING
      },
      jumlah_kamar: {
        type: Sequelize.INTEGER
      },
      id_tipe_kamar: {
        type: Sequelize.INTEGER
      },
      status_pemesanan: {
        type: Sequelize.STRING
      },
      id_user: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('pemesanans');
  }
};