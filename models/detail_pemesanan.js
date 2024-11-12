module.exports = (sequelize, DataTypes) => {
  const DetailPemesanan = sequelize.define('DetailPemesanan', {
    id_detail_pemesanan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_pemesanan: DataTypes.INTEGER,
    id_kamar: DataTypes.INTEGER,
    tgl_akses: DataTypes.DATE,
    harga: DataTypes.INTEGER
  }, {
    tableName: 'detail_pemesanan',
    timestamps: false
  });

  // Relationships
  DetailPemesanan.associate = (models) => {
    DetailPemesanan.belongsTo(models.Pemesanan, {
      foreignKey: 'id_pemesanan',
      as: 'pemesanan'
    });

    DetailPemesanan.belongsTo(models.Kamar, {
      foreignKey: 'id_kamar',
      as: 'kamar'
    });
  };

  return DetailPemesanan;
};
