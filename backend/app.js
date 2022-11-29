require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const blogsRouter = require('./routes/blogs');
const projectsRouter = require('./routes/projects');
const logRouter = require('./routes/log');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/blogs', blogsRouter);
app.use('/projects', projectsRouter);
app.use('/log', logRouter);


app.listen(process.env.APP_PORT, async () => {
    console.log('app running on ' + process.env.APP_PORT)
})
