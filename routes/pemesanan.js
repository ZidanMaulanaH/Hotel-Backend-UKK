const express = require('express');
const router = express.Router();
const db = require('../models'); // Sesuaikan dengan path ke model
const app = express()
// CREATE Pemesanan
router.post('/', async (req, res) => {
    try {
        const newOrder = await db.Pemesanan.create(req.body);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
});



// READ all Pemesanan
router.get('/', async (req, res) => {
    try {
        const orders = await db.Pemesanan.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
});

// READ Pemesanan by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await db.Pemesanan.findByPk(req.params.id);
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving order', error: error.message });
    }
});

// UPDATE Pemesanan
router.put('/:id', async (req, res) => {
    try {
        const order = await db.Pemesanan.findByPk(req.params.id);
        if (order) {
            const updatedOrder = await order.update(req.body);
            res.status(200).json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
});

// DELETE Pemesanan
router.delete('/:id', async (req, res) => {
    try {
        const order = await db.Pemesanan.findByPk(req.params.id);
        if (order) {
            await order.destroy();
            res.status(204).send({ message: 'Delete success'}); // No Content
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
});

module.exports = router;
