'use strict'
var express       = require('express');
var users         = express.Router();
var bodyParser    = require('body-parser');
var db            = require('./../db/pg');
var path          = require('path');
var sneakerRoutes = require(path.join(__dirname, './sneakers'));    // directory path to sneakers.js!


users.post('/', db.createUser, (req,res)=>{
  res.redirect('/');                              // redirect to login page (to create a session)
});

users.get('/new', (req,res)=>{
  res.render('users/new_user', { data: '' });     // redirect to new_user form
});

users.post('/login', db.loginUser, (req,res)=>{   // sessions are logged here
  req.session.user = res.rows;
  req.session.save( ()=>res.redirect('/sneakers/') );     // must save session before redirecting!
});

users.delete('/logout', (req,res)=>{                      // delete user session|cookie
  req.session.destroy( (err)=>res.redirect('/') );
});

users.use('/sneakers', sneakerRoutes);
module.exports = users;