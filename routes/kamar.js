// routes/kamar.js
const express = require('express');
const router = express.Router();
const { Kamar, TipeKamar } = require('../models');

// GET all rooms (kamar)
router.get('/', async (req, res) => {
    try {
        const kamars = await Kamar.findAll({
            include: TipeKamar  // Include room type (TipeKamar) in the response
        });
        res.status(200).json(kamars);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving rooms', error: error.message });
    }
});

// GET a single room by id
router.get('/:id_kamar', async (req, res) => {
    try {
        const kamar = await Kamar.findByPk(req.params.id_kamar, {
            include: TipeKamar
        });
        if (kamar) {
            res.status(200).json(kamar);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving room', error: error.message });
    }
});

// POST a new room
router.post('/', async (req, res) => {
    try {
        const newKamar = await Kamar.create({
            nomor_kamar: req.body.nomor_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar
        });
        res.status(201).json(newKamar);
    } catch (error) {
        res.status(500).json({ message: 'Error creating room', error: error.message });
    }
});

// PUT to update a room by id
router.put('/:id_kamar', async (req, res) => {
    try {
        const kamar = await Kamar.findByPk(req.params.id_kamar);
        if (kamar) {
            kamar.nomor_kamar = req.body.nomor_kamar || kamar.nomor_kamar;
            kamar.id_tipe_kamar = req.body.id_tipe_kamar || kamar.id_tipe_kamar;

            await kamar.save();
            res.status(200).json(kamar);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating room', error: error.message });
    }
});

// DELETE a room by id
router.delete('/:id_kamar', async (req, res) => {
    try {
        const kamar = await Kamar.findByPk(req.params.id_kamar);
        if (kamar) {
            await kamar.destroy();
            res.status(200).json({ message: 'Room deleted successfully' });
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room', error: error.message });
    }
});

module.exports = router;