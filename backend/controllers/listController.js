const config = require('../config');
const {parseLimit} = require('./validation');

// Builds the GET handler shared by the list endpoints: validates ?n=, reads through the model,
// and hands db errors to the express error handler instead of leaving the request hanging.
function makeList(model) {
    return async function list(req, res, next) {
        const limit = parseLimit(req.query.n, config.maxRecords);
        if (limit === null) return res.status(400).send('numbers only');
        try {
            const data = await model.findMany(limit);
            res.send({data});
        } catch (err) {
            next(err);
        }
    };
}

module.exports = {makeList};
