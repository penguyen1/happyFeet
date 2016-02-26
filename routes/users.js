'use strict'
var express     = require('express');
var users       = express.Router();
var bodyParser  = require('body-parser');
var db          = require('./../db/pg');

users.post('/', /*db.createUser,*/ (req,res)=>{
  res.redirect('/');    // need to redirect to user_home page
                        // access user_id database (how do we get user_id?)
});

users.get('/new', (req,res)=>{
  res.render('users/new_user');     // redirect to new_user form
});

users.post('/login', /*db.loginUser,*/ (req,res)=>{           // sessions are logged here
  // console.log(res.rows);
  req.session.user = res.rows;                      // stores user into sessions
  req.session.save( ()=>res.redirect('/test') );    // must save session before redirecting!    // need to redirect to user_home page (how to get user_id??)
});

users.delete('/logout', (req,res)=>{                // delete user session|cookie
  req.session.destroy( (err)=>res.redirect('/') );
});

module.exports = users;