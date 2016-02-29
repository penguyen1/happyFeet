'use strict'
var express     = require('express');
var sneakers    = express.Router();
var bodyParser  = require('body-parser');
var db          = require('./../db/pg');

// NOTE TO SELF:::
// req.session.user(:member_id, :email, :password_digest) can be acquired here!
// member_id = req.session.user.member_id 
// sneaker_id = req.params.id

// QUESTIONS: 
// can i get req.session.user.member_id in pg.js?

// show user homepage (+ inventoried sneakers)
sneakers.get('/', db.allSneakers, (req,res)=>{
  res.render('pages/user_home', { data: res.rows });         // display all queried sneakers 
});

// show add sneaker form
sneakers.route('/new')
  .get((req,res)=>{
    res.render('pages/sneaker_form', { 
      data: {   title: 'Add A New Sneaker',           // add sneaker properties
                route: '/sneakers/new',               // POST new sneaker
                buttonTitle: 'Add Sneaker',  
                sneaker: {} }                         // empty obj for sneaker info (edit route)
    });
  })
  .post(db.addSneaker,(req,res)=>{
    res.redirect('/sneakers/');
  });

// show all queried sneakers from search
sneakers.get('/search', db.searchSneaker, (req,res)=>{
  res.render('pages/search_results', { data: res.rows });
});

// show edit sneaker form
sneakers.get('/:id/edit', db.getSneaker, (req,res)=>{
  eval(pry.it)
  res.render('pages/sneaker_form', { 
    data: {   title: 'Edit Sneaker',                            // edit sneaker properties
              route: `/sneakers/${req.params.id}?_method=PUT`,  // method override here for PUT
              buttonTitle: 'Edit Sneaker',  
              sneaker: res.rows[0] }                            // pre-fill fields with current sneaker info
  });
});

// show sneaker profile
sneakers.route('/:id')
  .get(db.getSneaker, (req,res)=>{
    // eval(pry.it)
    res.render('pages/sneaker', { data: res.rows[0] });
  })
  .post(db.addInventory, (req,res)=>{
    res.redirect('/sneakers/');
  })
  .put(db.editSneaker, (req,res)=>{
    res.redirect('/sneakers/');
  })
  .delete(db.removeSneaker, (req,res)=>{
    res.redirect('/sneakers/');
  });


module.exports = sneakers;









