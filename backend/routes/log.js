const express = require('express');
const {create} = require('../controllers/log');
const router = express.Router();

/* add log entry. */
router.post('/', create);

module.exports = router;
