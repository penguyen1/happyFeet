'use strict'
var express       = require('express');
var users         = express.Router();
var bodyParser    = require('body-parser');
var db            = require('./../db/pg');
var path          = require('path');
var sneakerRoutes = require(path.join(__dirname, './sneakers'));    // directory path to sneakers.js!


users.post('/', db.createUser, (req,res)=>{
  res.redirect('/');                // redirect to login page (to create a session)
});

users.get('/new', (req,res)=>{
  res.render('users/new_user');     // redirect to new_user form
});

// users.get('/login', (req,res)=>{    // used to be redirected from .post('/'), but now not needed.
//   res.redirect('/test');            // .post('/') will now redirect to ('/') the login page, requiring the user to login 
// });                                 // which redirects to .post('/login') where it'll be redirected to the user's homepage [ .get('/sneakers/') ] 

users.post('/login', db.loginUser, (req,res)=>{           // sessions are logged here
  req.session.user = res.rows;
  console.log("req.session.user.member_id: " + req.session.user.member_id);
  req.session.save( ()=>res.redirect('/sneakers/') );     // must save session before redirecting!    // need to redirect to user_home page (how to get user_id??)
});

users.delete('/logout', (req,res)=>{                      // delete user session|cookie
  console.log('logging out!');
  req.session.destroy( (err)=>res.redirect('/') );
});

users.use('/sneakers', sneakerRoutes);
module.exports = users;