const {findMany} = require('./table');

const TABLE = 'user';

const User = {
    findMany: (limit) => findMany(TABLE, limit),
};

module.exports = User;
