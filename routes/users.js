const express = require('express');
const router = express.Router();
const { User } = require('../models');  // Import the User model

// Get user by id_user
router.get('/:id_user', async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id_user: req.params.id_user }
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
});

router.put('/:id_user', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id_user);  // Find user by primary key (id_user)
        if (user) {
            // Update user attributes with request body data
            user.nama_user = req.body.nama_user;
            user.email = req.body.email;
            user.password = req.body.password;
            user.role = req.body.role;
            await user.save();  // Save updated user

            res.status(200).json(user);  // Send updated user as response
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

module.exports = router;  // Export the router