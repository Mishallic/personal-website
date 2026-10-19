const Blog = require('../models/blog');
const {makeList} = require('./listController');

module.exports = {list: makeList(Blog)};
