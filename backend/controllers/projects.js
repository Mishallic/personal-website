const Project = require('../models/project');
const {makeList} = require('./listController');

module.exports = {list: makeList(Project)};
