module.exports = (sequelize, DataTypes) => {
  const Pemesanan = sequelize.define('Pemesanan', {
    id_pemesanan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nomor_pemesanan: DataTypes.INTEGER,
    nama_pemesan: DataTypes.STRING,
    email_pemesan: DataTypes.STRING,
    tgl_pemesanan: DataTypes.DATE,
    tgl_check_in: DataTypes.DATE,
    tgl_check_out: DataTypes.DATE,
    nama_tamu: DataTypes.STRING,
    jumlah_kamar: DataTypes.INTEGER,
    status_pemesanan: DataTypes.ENUM('baru', 'check_in', 'check_out'),
    id_user: DataTypes.INTEGER,
    id_tipe_kamar: DataTypes.INTEGER
  }, {
    tableName: 'pemesanan',
    timestamps: false
  });

  // Relationships
  Pemesanan.associate = (models) => {
    Pemesanan.belongsTo(models.User, {
      foreignKey: 'id_user',
      as: 'user'
    });

    Pemesanan.hasMany(models.DetailPemesanan, {
      foreignKey: 'id_pemesanan',
      as: 'detail_pemesanan'
    });

    Pemesanan.belongsTo(models.TipeKamar, {
      foreignKey: 'id_tipe_kamar',
      as: 'tipe_kamar'
    });
  };

  module.exports = (sequelize, DataTypes) => {
    const Pemesanan = sequelize.define('Pemesanan', {
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_kamar: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tanggal_checkin: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        tanggal_checkout: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        total_harga: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    return Pemesanan;
};

Pemesanan.associate = function(models) {
  Pemesanan.belongsTo(models.TipeKamar, { as: 'TipeKamar', foreignKey: 'id_tipe_kamar' });
};
  return Pemesanan;
};
