const express = require('express');
const app = express();
const authRouter = require('./routes/auth_route.js');
const dbConnect = require('./config/db_config.js');
const cookieParser = require('cookie-parser');
require('dotenv').config();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//db connection
dbConnect();

//routes
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send("Hello from express");
});


module.exports = app;
