// routes/kamar.js
const express = require('express');
const router = express.Router();
const { Kamar, TipeKamar } = require('../models');

// GET all rooms (kamar)
router.get('/', async (req, res) => {
    try {
        const kamars = await TipeKamar.findAll()
        res.status(200).json(kamars);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving rooms', error: error.message });
    }
});

module.exports = router;