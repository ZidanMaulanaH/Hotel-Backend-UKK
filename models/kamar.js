// models/kamar.js
module.exports = (sequelize, DataTypes) => {
  const Kamar = sequelize.define('Kamar', {
      id_kamar: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      nomor_kamar: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      id_tipe_kamar: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'TipeKamar', // Assumes you have a TipeKamar model
              key: 'id_tipe_kamar'
          }
      }
  }, {
      tableName: 'kamar',
      timestamps: false
  });

  Kamar.associate = (models) => {
      Kamar.belongsTo(models.TipeKamar, { foreignKey: 'id_tipe_kamar' });
  };

  return Kamar;
};
