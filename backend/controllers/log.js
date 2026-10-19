const Log = require('../models/log');
const {isFilledString} = require('./validation');

async function create(req, res, next) {
    const {cmd, info} = req.body || {};
    if (!isFilledString(cmd) || !isFilledString(info))
        return res.status(400).send('Incomplete Data');
    try {
        await Log.create({cmd, info});
        res.status(201).end();
    } catch (err) {
        next(err);
    }
}

module.exports = {create};
