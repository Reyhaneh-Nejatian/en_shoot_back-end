const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');


//Home


//Auth
router.use('/api/auth', authRoutes);

module.exports = router;