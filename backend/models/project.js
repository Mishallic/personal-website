const {findMany} = require('./table');

const TABLE = 'project';

const Project = {
    findMany: (limit) => findMany(TABLE, limit),
};

module.exports = Project;
