const config = require('./config'); // loads .env files and validates them before anything else
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const blogsRouter = require('./routes/blogs');
const projectsRouter = require('./routes/projects');
const logRouter = require('./routes/log');

const app = express();

app.use(logger(config.logFormat));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/blogs', blogsRouter);
app.use('/projects', projectsRouter);
app.use('/log', logRouter);

app.use((req, res) => res.status(404).send('Not Found'));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(config.isProduction ? 'Internal Server Error' : `Internal Server Error: ${err.message}`);
});

app.listen(config.port, () => {
    console.log(`app running on ${config.port} (${config.env})`)
})
