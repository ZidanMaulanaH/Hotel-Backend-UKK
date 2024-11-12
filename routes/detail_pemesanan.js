const express = require('express');
const router = express.Router();
const db = require('../models'); // Sesuaikan dengan path ke model

// CREATE Detail Pemesanan
router.post('/', async (req, res) => {
    try {
        const newDetailOrder = await db.detail_pemesanan.create(req.body);
        res.status(201).json(newDetailOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating detail order', error: error.message });
    }
});

// READ all Detail Pemesanan
router.get('/', async (req, res) => {
    try {
        const detailOrders = await db.detail_pemesanan.findAll();
        res.status(200).json(detailOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving detail orders', error: error.message });
    }
});

// READ Detail Pemesanan by ID
router.get('/:id', async (req, res) => {
    try {
        const detailOrder = await db.detail_pemesanan.findByPk(req.params.id);
        if (detailOrder) {
            res.status(200).json(detailOrder);
        } else {
            res.status(404).json({ message: 'Detail order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving detail order', error: error.message });
    }
});

// UPDATE Detail Pemesanan
router.put('/:id', async (req, res) => {
    try {
        const detailOrder = await db.detail_pemesanan.findByPk(req.params.id);
        if (detailOrder) {
            const updatedDetailOrder = await detailOrder.update(req.body);
            res.status(200).json(updatedDetailOrder);
        } else {
            res.status(404).json({ message: 'Detail order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating detail order', error: error.message });
    }
});

// DELETE Detail Pemesanan
router.delete('/:id', async (req, res) => {
    try {
        const detailOrder = await db.DetailPemesanan.findByPk(req.params.id);
        if (detailOrder) {
            await detailOrder.destroy();
            res.status(204).send(); // No Content
        } else {
            res.status(404).json({ message: 'Detail order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting detail order', error: error.message });
    }
});

module.exports = router;
