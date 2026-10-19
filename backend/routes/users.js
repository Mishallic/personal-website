const express = require('express');
const {list} = require('../controllers/users');
const router = express.Router();

/* GET users listing. Not mounted in app.js. */
router.get('/', list);

module.exports = router;
