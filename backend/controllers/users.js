const User = require('../models/user');
const {makeList} = require('./listController');

module.exports = {list: makeList(User)};
