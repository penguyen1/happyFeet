'use strict'
var express     = require('express');
var sneakers    = express.Router();
var bodyParser  = require('body-parser');
var db          = require('./../db/pg');

// new sneaker form
// show all queried sneakers from search
// show sneaker profile

// show user homepage (w/ stored sneakers)
sneakers.get('/', (req,res)=>{
  // display req.session.user(member_id, email, password_digest) sent from users.js
  console.log(req.session.user);
  res.render('users/test', { user: req.session.user });
});







module.exports = sneakers;