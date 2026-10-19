const express = require('express');
const {list} = require('../controllers/blogs');
const router = express.Router();

/* GET blogs listing. */
router.get('/', list);

module.exports = router;
