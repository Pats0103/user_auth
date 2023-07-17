const express = require('express');
const app = express();
const authRouter = require('./routes/auth_route.js');
const dbConnect = require('./config/db_config.js');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors');
//middleware
app.use(express.static('client/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5001',
    credentials: true
}));
//db connection
dbConnect();

//routes
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/client/index.html");
});


module.exports = app;
