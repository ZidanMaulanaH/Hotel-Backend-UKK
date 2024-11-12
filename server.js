require('dotenv').config();

const PDFDocument = require('pdfkit');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models'); // Import Sequelize models
const Routes = require('router');
const app = express();
const Pemesanan = db.Pemesanan;
const tipeKamar = db.tipe_kamar
const PORT = 3000;
const kamarRoutes = require('./routes/kamar');
const tipeRoutes = require('./routes/tipe_kamar');
const pemesananRoutes = require('./routes/pemesanan');
const multer = require('multer');  // Import multer kanggo upload file
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const detailPemesananRoutes = require('./routes/detail_pemesanan'); // Sesuaikan path
const DetailPemesanan = require('./models/detail_pemesanan');
const path = require('path')


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Example Routes (Update with your routes)
app.get('/', (req, res) => {
  res.send('Welcome to the UKKdos API!');
});

// Sequelize Sync to Ensure Tables Are Created
db.sequelize.sync()
  .then(() => {
    console.log('Database synced!');
  })
  .catch((error) => {
    console.error('Unable to sync the database:', error);
  });
 //Users CRUD

 app.post('/users', async (req, res) => {
    const { nama_user, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Mengenkripsi password
        const newUser = await db.User.create({
            nama_user,
            email,
            password: hashedPassword,
            role // Pastikan role diisi dengan 'admin' atau 'resepsionis'
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

        // Check role for access message
        if (user.role === 'admin' || user.role === 'resepsionis') {
            res.json({token});
        } else {
            res.json({ message: 'Login successful, akses ditolak', token });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

  app.get('/users', async (req, res) => {
    try {
      const users = await db.User.findAll(); // Fetch all users from the database
      res.status(200).json(users); // Return the users as JSON
    } catch (error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/users/:id', async (req, res) => {
    try {
        const user = await db.User.findByPk(req.params.id);  // Find user by primary key (id)
        if (user) {
            res.status(200).json(user);  // Return user data if found
        } else {
            res.status(404).json({ message: 'User not found' });  // If user is not found, return 404
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
});

app.get('/user/filter/:field', async (req, res) => {
    try {
        const { field } = req.params;
        const { value } = req.query;

        let filter = {};

        if (field && value) {
            switch (field) {
                case 'nama_user':
                    filter.nama_user = value;
                    break;
                case 'email':
                    filter.email = value;
                    break;
                default:
                    return res.status(400).json({ message: 'Field filter tidak valid untuk user' });
            }
        } else {
            return res.status(400).json({ message: 'Parameter filter atau nilai tidak lengkap' });
        }

        const hasilPencarian = await db.User.findAll({ where: filter });
        
        res.status(200).json(hasilPencarian);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mencari user', error: error.message });
    }
});


// PUT request to update user by id
app.put('/users/:id', async (req, res) => {
  try {
      // Find the user by primary key (id)
      const user = await db.User.findByPk(req.params.id);
      
      if (user) {
          // Update the user fields with data from the request body
          user.nama_user = req.body.nama_user || user.nama_user;
          user.email = req.body.email || user.email;
          user.password = req.body.password || user.password;  // Make sure to hash the password in a real app!
          user.role = req.body.role || user.role;

          // Save the updated user to the database
          await user.save();

          // Respond with the updated user data
          res.status(200).json(user);
      } else {
          // If the user is not found, return a 404 error
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      // Catch any errors and return a 500 status with the error message
      res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// DELETE request to delete a user by id
app.delete('/users/:id', async (req, res) => {
  try {
      // Find the user by primary key (id)
      const user = await db.User.findByPk(req.params.id);
      
      if (user) {
          // Delete the user if found
          await user.destroy();

          // Respond with a success message
          res.status(200).json({ message: 'User deleted successfully' });
      } else {
          // If the user is not found, return a 404 error
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      // Catch any errors and return a 500 status with the error message
      res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});


//end users CRUD

//kamar CRUD

app.post('/kamar', async (req, res) => {
    try {
        const newKamar = await db.Kamar.create({
            nomor_kamar: req.body.nomor_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar
        });

        res.status(201).json(newKamar);  // Respond with the created room data
    } catch (error) {
        res.status(500).json({ message: 'Error creating room', error: error.message });
    }
});


app.get('/kamar', auth, async (req, res) => {
    try {
        if (req.user.role == 'resepionis') {
            const kamar = await db.Kamar.findAll(); // Mendapatkan semua kamar
            return res.status(200).json(kamar);
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving kamar', error: error.message });
    }
});
app.get('/kamar/:id', async (req, res) => {
    try {
        const kamar = await db.Kamar.findByPk(req.params.id);
        if (kamar) {
            res.status(200).json(kamar);
        } else {
            res.status(404).json({ message: 'Kamar not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving kamar', error: error.message });
    }
});


const { Op } = require("sequelize");

app.get('/kamar/filter/:field', async (req, res) => {
    try {
        const { field } = req.params;
        const { value } = req.query;

        let filter = {};

        if (field && value) {
            // Membuat filter dinamis berdasarkan field yang diminta
            switch (field) {
                case 'nomor_kamar':
                    filter.nomor_kamar = value;
                    break;
                case 'id_tipe_kamar':
                    filter.id_tipe_kamar = value;
                    break;
                // Tambahkan case tambahan sesuai dengan field yang ingin didukung sebagai filter
                default:
                    return res.status(400).json({ message: 'Field filter tidak valid' });
            }
        } else {
            return res.status(400).json({ message: 'Parameter filter atau nilai tidak lengkap' });
        }

        const hasilPencarian = await db.Kamar.findAll({ where: filter });
        
        res.status(200).json(hasilPencarian);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mencari kamar', error: error.message });
    }
});


// PUT (Update kamar adhedhasar id)
app.put('/kamar/:id', async (req, res) => {
  try {
      const kamar = await db.Kamar.findByPk(req.params.id);
      if (kamar) {
          kamar.nomor_kamar = req.body.nomor_kamar;
          kamar.id_tipe_kamar = req.body.id_tipe_kamar;
          kamar.foto = req.body.foto;
          await kamar.save();  // Simpen perubahan ing database
          res.status(200).json(kamar);
      } else {
          res.status(404).json({ message: 'Kamar not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error updating kamar', error: error.message });
  }
});


// DELETE (Hapus kamar adhedhasar id)
app.delete('/kamar/:id', async (req, res) => {
  try {
      const kamar = await db.Kamar.findByPk(req.params.id);
      if (kamar) {
          await kamar.destroy();  // Hapus kamar saka database
          res.status(200).json({ message: 'Kamar deleted' });
      } else {
          res.status(404).json({ message: 'Kamar not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error deleting kamar', error: error.message });
  }
});


//end kamar CRUD

//Pemesanan CRUD

app.use('/pemesanan', pemesananRoutes);

app.post('/pemesanan', (req, res) => {
    // Hitung lama menginap dalam hari
    const checkIn = new Date(req.body.tgl_check_in);
    const checkOut = new Date(req.body.tgl_check_out);
    const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)); // durasi dalam hari

    // Hitung total harga berdasarkan harga tipe kamar, jumlah kamar, dan durasi inap
    const totalHarga = hargaPerKamar * req.body.jumlah_kamar * duration;

    // Buat pemesanan baru
    db.Pemesanan.create({
        nama_hotel: req.body.namaHotel,
        nomor_pemesanan: req.body.nomor_pemesanan,
        nama_pemesan: req.body.nama_pemesan,
        email_pemesan: req.body.email_pemesan,
        tgl_pemesanan: req.body.tgl_pemesanan,
        tgl_check_in: req.body.tgl_check_in,
        tgl_check_out: req.body.tgl_check_out,
        jumlah_kamar: req.body.jumlah_kamar,
        id_tipe_kamar: req.body.id_tipe_kamar,
        status_pemesanan: req.body.status_pemesanan,
        id_user: req.body.id_user,
        total_harga: totalHarga // Simpan total harga yang dihitung
    })
    .then(newPemesanan => {
        // Kembalikan nota pembayaran sebagai respons
        res.status(201).json(newPemesanan);
    })
    .catch(error => {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    });
});

app.get('/nota/:id', async (req, res) => {
    try {
        const idPemesanan = req.params.id;
        
        // Ambil data pemesanan dari database
        const pemesanan = await db.Pemesanan.findByPk(idPemesanan, {
            include: [{ 
                model: db.TipeKamar,
                as: 'TipeKamar'
            }]
        });

        const TotalHarga = pemesanan.durasi_menginap * pemesanan.jumlah_kamar * pemesanan.hargaPerKamar;

        if (!pemesanan) {
            return res.status(404).json({ message: 'Pemesanan tidak ditemukan' });
        }

        // Hitung durasi menginap
        const checkIn = new Date(pemesanan.tgl_check_in);
        const checkOut = new Date(pemesanan.tgl_check_out);
        const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        // Buat objek nota
        const nota = {
            nomor_pemesanan: pemesanan.nomor_pemesanan,
            nama_pemesan: pemesanan.nama_pemesan,
            email_pemesan: pemesanan.email_pemesan,
            tgl_pemesanan: pemesanan.tgl_pemesanan,
            tgl_check_in: pemesanan.tgl_check_in,
            tgl_check_out: pemesanan.tgl_check_out,
            jumlah_kamar: pemesanan.jumlah_kamar,
            tipe_kamar: pemesanan.TipeKamar.nama_tipe_kamar,
            harga_per_kamar: pemesanan.TipeKamar.harga,
            durasi_menginap: duration,
            status_pemesanan: pemesanan.status_pemesanan
        };

        total_harga = pemesanan.jumlah_kamar*pemesanan.durasi_menginap*pemesanan.harga_per_kamar; 

        // Buat PDF
        const doc = new PDFDocument();
        const filename = `nota_${pemesanan.nama_pemesan}.pdf`;

        // Tentukan path untuk menyimpan file di folder 'folder nota'
        const savePath = path.join('UKKDOS', 'folder nota', 'nota');

        // Pastikan direktori ada
        if (!fs.existsSync(path.dirname(savePath))) {
            fs.mkdirSync(path.dirname(savePath), { recursive: true });
        }

        // Pipe PDF ke file sistem dan response
        const stream = fs.createWriteStream(savePath);
        doc.pipe(stream);
        doc.pipe(res);

        // Set header untuk file PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Desain PDF
        doc.fontSize(20).text('NOTA PEMESANAN HOTEL WIKUSAMA', { align: 'center' });
        doc.moveDown();

        // Fungsi helper untuk menambahkan baris
        const addLine = (label, value) => {
            doc.fontSize(12).text(`${label}: ${value}`);
        };

        // Tambahkan informasi nota
        addLine('Nomor Pemesanan', nota.nomor_pemesanan);
        addLine('Nama Pemesan', nota.nama_pemesan);
        addLine('Email Pemesan', nota.email_pemesan);
        addLine('Tanggal Pemesanan', new Date(nota.tgl_pemesanan).toLocaleDateString());
        doc.moveDown();
        
        addLine('Check-in', new Date(nota.tgl_check_in).toLocaleDateString());
        addLine('Check-out', new Date(nota.tgl_check_out).toLocaleDateString());
        addLine('Durasi Menginap', `${nota.durasi_menginap} hari`);
        doc.moveDown();
        
        addLine('Tipe Kamar', nota.tipe_kamar);
        addLine('Jumlah Kamar', nota.jumlah_kamar);
        addLine('Harga per Kamar', `Rp ${nota.harga_per_kamar}`);
        doc.moveDown();
        
        addLine('Total Harga', `Rp ${nota.total_harga= nota.harga_per_kamar*nota.jumlah_kamar*nota.durasi_menginap}`);
        addLine('Status Pemesanan', nota.status_pemesanan);
        
        doc.moveDown();
        doc.fontSize(10).text('Terima kasih atas pemesanan Anda!', { align: 'center' });

        // Finalisasi PDF
        doc.end();

        // Tunggu hingga stream selesai menulis
        stream.on('finish', () => {
            console.log(`PDF berhasil disimpan`);
        });

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ 
                message: 'Terjadi kesalahan saat membuat nota', 
                error: error.message 
            });
        }
    }
});

app.get('/pemesanan', async (req, res) => {
    try {
        const orders = await db.Pemesanan.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
});

app.get('/pemesanan/filter/:field', async (req, res) => {
    try {
        const { field } = req.params;
        const { value } = req.query;

        let filter = {};

        if (field && value) {
            switch (field) {
                case 'nomor_pemesanan':
                    filter.nomor_pemesanan = { [Op.like]: `%${value}%` };
                    break;
                case 'status_pemesanan':
                    filter.status_pemesanan = value;
                    break;
                case 'nama_pemesan':
                    filter.nama_pemesan = value;
                    break;
                case 'jumlah_kamar':
                    filter.jumlah_kamar = value;
                    break;
                default:
                    return res.status(400).json({ message: 'Field filter tidak valid untuk pemesanan' });
            }
        } else {
            return res.status(400).json({ message: 'Parameter filter atau nilai tidak lengkap' });
        }

        const hasilPencarian = await db.Pemesanan.findAll({ where: filter });
        res.status(200).json(hasilPencarian);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mencari pemesanan', error: error.message });
    }
});


// Update a booking by ID (PUT)
app.put('/pemesanan/:id_pemesanan', async (req, res) => {
  try {
      const pemesanan = await db.Pemesanan.findByPk(req.params.id_pemesanan);
      if (pemesanan) {
          // Update fields
          pemesanan.nomor_pemesanan = req.body.nomor_pemesanan || pemesanan.nomor_pemesanan;
          pemesanan.nama_pemesan = req.body.nama_pemesan || pemesanan.nama_pemesan;
          pemesanan.email_pemesan = req.body.email_pemesan || pemesanan.email_pemesan;
          pemesanan.tgl_check_in = req.body.tgl_check_in || pemesanan.tgl_check_in;
          pemesanan.tgl_check_out = req.body.tgl_check_out || pemesanan.tgl_check_out;
          pemesanan.jumlah_kamar = req.body.jumlah_kamar || pemesanan.jumlah_kamar;
          pemesanan.id_tipe_kamar = req.body.id_tipe_kamar || pemesanan.id_tipe_kamar;
          pemesanan.status_pemesanan = req.body.status_pemesanan || pemesanan.status_pemesanan;

          await pemesanan.save();  // Save the updated record

          res.status(200).json(pemesanan);
      } else {
          res.status(404).json({ message: 'Booking not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

// Delete a booking by ID (DELETE)
app.delete('/pemesanan/:id_pemesanan', async (req, res) => {
  try {
      const pemesanan = await db.Pemesanan.findByPk(req.params.id_pemesanan);
      if (pemesanan) {
          await pemesanan.destroy();  // Delete the record
          res.status(200).json({ message: 'Booking deleted successfully'});
      } else {
          res.status(404).json({ message: 'Booking not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
});
//end Pemasanan CRUD

//tipe_kamar CRUD

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');  // Folder kanggo nyimpen file
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);  // Nambah timestamp supaya unik
  }
});

const upload = multer({ storage: storage });  // Multer config
app.use('/tipe', tipeRoutes);
app.use(express.json());  // Supaya bisa parsing JSON

// Endpoint kanggo nambah tipe_kamar karo upload file (foto)
app.post('/tipe_kamar', upload.single('foto'), async (req, res) => {
  try {
      // Nambah tipe_kamar anyar karo file sing diunggah
      const newTipeKamar = await db.TipeKamar.create({
          nama_tipe_kamar: req.body.nama_tipe_kamar,
          harga: req.body.harga,
          deskripsi: req.body.deskripsi,
          foto: req.file ? req.file.filename : null  // Simpen nama file foto sing diunggah
      });

      // Yen sukses, kirim respon status 201 lan data tipe_kamar anyar
      res.status(201).json(newTipeKamar);
  } catch (error) {
      // Yen ana kesalahan, kirim respon status 500 karo pesan error
      res.status(500).json({ message: 'Error creating tipe_kamar', error: error.message });
  }
});


app.get('/tipe_kamar', auth, async (req, res) => {
    try {
        if (req.user.role == 'admin') {
            const tipe_kamar = await db.TipeKamar.findAll(); // Mendapatkan semua kamar
            return res.status(200).json(tipe_kamar);
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving kamar', error: error.message });
    }
});

// GET tipe_kamar by id (njaluk tipe_kamar kanthi id)
app.get('/tipe_kamar/:id', async (req, res) => {
  try {
      const tipeKamar = await db.TipeKamar.findByPk(req.params.id);  // Njaluk tipe_kamar adhedhasar ID
      if (tipeKamar) {
          res.status(200).json(tipeKamar);  // Yen ketemu, kirim data
      } else {
          res.status(404).json({ message: 'Tipe Kamar not found' });  // Yen ora ketemu, kirim status 404
      }
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving tipe_kamar', error: error.message });
  }
});

app.get('/tipe_kamar/filter/:field', async (req, res) => {
    try {
        const { field } = req.params;
        const { value } = req.query;

        let filter = {};

        if (field && value) {
            switch (field) {
                case 'nama_tipe_kamar':
                    filter.nama_tipe_kamar = value;
                    break;
                case 'harga':
                    filter.harga = value;
                    break;
                case 'deskripsi':
                    filter.deskripsi = value;
                    break;
                default:
                    return res.status(400).json({ message: 'Field filter tidak valid untuk tipe kamar' });
            }
        } else {
            return res.status(400).json({ message: 'Parameter filter atau nilai tidak lengkap' });
        }

        const hasilPencarian = await db.TipeKamar.findAll({ where: filter });
        
        res.status(200).json(hasilPencarian);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mencari tipe kamar', error: error.message });
    }
});


app.post('/tipe_kamar', async (req, res) => {
  try {
      // Nambah tipe_kamar anyar karo data sing ditampa saka request body
      const newTipeKamar = await db.TipeKamar.create({
          nama_tipe_kamar: req.body.nama_tipe_kamar,  
          harga: req.body.harga,                     
          deskripsi: req.body.deskripsi,            
          foto: req.body.foto                     
      });
      
      // Yen sukses, kirim respon status 201 lan data tipe_kamar anyar
      res.status(201).json(newTipeKamar);
  } catch (error) {
      // Yen ana kesalahan, kirim respon status 500 karo pesan error
      res.status(500).json({ message: 'Error creating tipe_kamar', error: error.message });
  }
});


// PUT (Update tipe_kamar adhedhasar id)
app.put('/tipe_kamar/:id', async (req, res) => {
  try {
      const tipeKamar = await db.TipeKamar.findByPk(req.params.id);
      if (tipeKamar) {
          tipeKamar.nama_tipe_kamar = req.body.nama_tipe_kamar;
          tipeKamar.harga = req.body.harga;
          tipeKamar.deskripsi = req.body.deskripsi;
          tipeKamar.foto = req.body.foto;
          await tipeKamar.save();  // Simpen perubahan ing database
          res.status(200).json(tipeKamar);
      } else {
          res.status(404).json({ message: 'Tipe Kamar not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error updating tipe_kamar', error: error.message });
  }
});


// DELETE (Hapus tipe_kamar adhedhasar id)
app.delete('/tipe_kamar/:id', async (req, res) => {
  try {
      const tipeKamar = await db.TipeKamar.findByPk(req.params.id);
      if (tipeKamar) {
          await tipeKamar.destroy();  // Hapus tipe_kamar saka database
          res.status(200).json({ message: 'Tipe Kamar deleted' });
      } else {
          res.status(404).json({ message: 'Tipe Kamar not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error deleting tipe_kamar', error: error.message });
  }
});

//end tipe_kamar CRUD

//detail pemesanan CRUD

app.use('/detailPemesanan', detailPemesananRoutes);

app.post('/detail_pemesanan', async (req, res) => {
    try {
        const newDetailPemesanan = await db.DetailPemesanan.create({
            id_pemesanan: req.body.id_pemesanan, // Pastikan id_pemesanan valid
            id_kamar: req.body.id_kamar, // Pastikan id_kamar valid
            tgl_akses: req.body.tgl_akses,
            harga: req.body.harga
        });
        res.status(201).json(newDetailPemesanan);
    } catch (error) {
        res.status(500).json({ message: 'Error creating detail pemesanan', error: error.message });
    }
});

app.get('/detail_pemesanan', auth, async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const diteilpemesanan = await db.DetailPemesanan.findAll(); // Mendapatkan semua kamar
            return res.status(200).json(diteilpemesanan);
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving kamar', error: error.message });
    }
});

app.get('/detail_pemesanan/:id', async (req, res) => {
    try {
        const detailPemesanan = await db.DetailPemesanan.findByPk(req.params.id);
        if (detailPemesanan) {
            res.status(200).json(detailPemesanan);
        } else {
            res.status(404).json({ message: 'Detail Pemesanan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving detail pemesanan', error: error.message });
    }
});

app.get('/detail_pemesanan/filter/:field', async (req, res) => {
    try {
        const { field } = req.params;
        const { value } = req.query;

        let filter = {};

        if (field && value) {
            switch (field) {
                case 'id_pemesanan':
                    filter.id_pemesanan = value;
                    break;
                case 'id_kamar':
                    filter.id_kamar = value;
                    break;
                default:
                    return res.status(400).json({ message: 'Field filter tidak valid untuk detail pemesanan' });
            }
        } else {
            return res.status(400).json({ message: 'Parameter filter atau nilai tidak lengkap' });
        }

        const hasilPencarian = await db.DetailPemesanan.findAll({ where: filter });
        
        res.status(200).json(hasilPencarian);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mencari detail pemesanan', error: error.message });
    }
});


app.put('/detail_pemesanan/:id', async (req, res) => {
    try {
        const detailPemesanan = await db.DetailPemesanan.findByPk(req.params.id);
        if (detailPemesanan) {
            detailPemesanan.id_pemesanan = req.body.id_pemesanan; // Pastikan id_pemesanan valid
            detailPemesanan.id_kamar = req.body.id_kamar; // Pastikan id_kamar valid
            detailPemesanan.tgl_akses = req.body.tgl_akses;
            detailPemesanan.harga = req.body.harga;
            await detailPemesanan.save();
            res.status(200).json(detailPemesanan);
        } else {
            res.status(404).json({ message: 'Detail Pemesanan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating detail pemesanan', error: error.message });
    }
});

app.delete('/detail_pemesanan/:id', auth, async (req, res) => {
        try {
            const detailOrder = await db.DetailPemesanan.findByPk(req.params.id);
            if (detailOrder) {
                await detailOrder.destroy();
                res.status(204).send({Message: 'Order deleted'}); 
            } else {
                res.status(404).json({ message: 'Detail order not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting detail order', error: error.message });
        }
    });



//end detail pemesanan CRUD

// Server listening
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});