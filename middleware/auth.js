const jwt = require('jsonwebtoken');

// Middleware untuk memeriksa token
const auth = (req, res, next) => {
    const token = req.header('Authorization').split(" ")[1]; // Mengambil token dari header
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Memverifikasi token
        req.user = verified; // Menyimpan user ke request

        // Jika token valid, lanjutkan ke route berikutnya
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = auth;