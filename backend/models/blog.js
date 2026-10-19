const {findMany} = require('./table');

const TABLE = 'blog';

const Blog = {
    findMany: (limit) => findMany(TABLE, limit),
};

module.exports = Blog;
