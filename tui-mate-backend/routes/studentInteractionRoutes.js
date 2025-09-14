const express = require('express');
const router = express.Router();
const studentInteractionController = require('../controllers/studentInteractionController');

// Log search
router.post('/interaction/search/:id', studentInteractionController.logSearch);

// Log filter usage
router.post('/interaction/filter/:id', studentInteractionController.logFilterUsage);


module.exports = router;
