'use strict'
var express     = require('express');
var sneakers    = express.Router();
var bodyParser  = require('body-parser');
var db          = require('./../db/pg');

// new sneaker form
// show all queried sneakers from search
// show sneaker profile

// show user homepage (w/ stored sneakers)
sneakers.get('/:id', (req,res)=>{
  // display user_id sent from users.js
});







module.exports = sneakers;