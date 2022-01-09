require('rootpath')();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
require('dotenv').config({ path : './.env' })

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const songRouter = require('./routes/song');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/songs', songRouter);

app.use(function (req, res, next) {
	res.status(404)
})

var config = JSON.parse(process.env.APP_CONFIG);

const url = process.env.DATABASE_URI
mongoose.connect("mongodb://" + config.mongo.user + ":" + encodeURIComponent(config.mongo.password) + "@" + config.mongo.hostString, {useNewUrlParser:true})

const db = mongoose.connection
db.once('open', _ =>{
	console.log("Database connected : " + url)
})
db.on('error', err => {
	console.log("connection error : " + err)
})

module.exports = app;
