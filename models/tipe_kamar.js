module.exports = (sequelize, DataTypes) => {
  const TipeKamar = sequelize.define('TipeKamar', {
    id_tipe_kamar: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_tipe_kamar: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    deskripsi: DataTypes.TEXT,
    foto: DataTypes.TEXT
  }, {
    tableName: 'tipe_kamar',
    timestamps: false
  });

  // Relationships
  TipeKamar.associate = (models) => {
    TipeKamar.hasMany(models.Kamar, {
      foreignKey: 'id_tipe_kamar',
      as: 'kamar'
    });

    TipeKamar.hasMany(models.Pemesanan, {
      foreignKey: 'id_tipe_kamar',
      as: 'pemesanan'
    });
  };

  return TipeKamar;
};
