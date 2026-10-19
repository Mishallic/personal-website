const express = require('express');
const {list} = require('../controllers/projects');
const router = express.Router();

/* GET projects listing. */
router.get('/', list);

module.exports = router;
