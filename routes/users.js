'use strict'
var express       = require('express');
var users         = express.Router();
var bodyParser    = require('body-parser');
var db            = require('./../db/pg');
var path          = require('path');
var sneakerRoutes = require(path.join(__dirname, './sneakers'));    // directory path to sneakers.js!


users.post('/', db.createUser, (req,res)=>{
  res.redirect('/users/login');    // need to redirect to user_home page
                        // access user_id database (how do we get user_id?)
});

users.get('/new', (req,res)=>{
  res.render('users/new_user');     // redirect to new_user form
});

users.get('/login', (req,res)=>{
  res.redirect('/test');
});

users.post('/login', db.loginUser, (req,res)=>{           // sessions are logged here
  // console.log(res.rows);
  req.session.user = res.rows;                      // stores user into sessions
  console.log(req.session.user.user_id);
  req.session.save( ()=>res.redirect('/sneakers/'+req.session.user.user_id) );    // must save session before redirecting!    // need to redirect to user_home page (how to get user_id??)
});

users.delete('/logout', (req,res)=>{                // delete user session|cookie
  req.session.destroy( (err)=>res.redirect('/') );
});

users.use('/sneakers', sneakerRoutes);
module.exports = users;