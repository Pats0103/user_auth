const express = require('express');
const { signup, signin,getuser, logout} = require('../controller/authController.js');
const authrouter= express.Router();
const jwtAuth = require('../middleware/jwtAuth.js');
authrouter.post("/signup", signup);
authrouter.post("/signin", signin);
authrouter.get("/user",jwtAuth,getuser)
authrouter.get("/logout", logout);


module.exports = authrouter;

