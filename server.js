pry = require('pryjs');
'use strict'
var express         = require('express');
var logger          = require('morgan');
var ejs             = require('ejs');
var path            = require('path');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');

var db              = require('./db/pg');               // links server.js to pg.js   // did this connect?
var app             = express();
var port            = process.env.PORT || 3000;
var sneakerRoutes   = require(path.join(__dirname, '/routes/sneakers'));    // directory path!

app.use( logger('dev') );
app.use( bodyParser.urlencoded({ extended: false }) );  // parses POST methods from forms
app.use( bodyParser.json() );
app.use( methodOverride('_method') );                   // allows PUT & DELETE methods
app.set( 'views', './views' );                          // root directory for ejs files
app.set( 'view engine', 'ejs' );
app.use(express.static(path.join(__dirname, 'semantic')));// static route to css files          // different route for semantic-UI???

// Homepage Route
app.get('/', (req,res)=>res.render('pages/login', {data: 'Welcome to Happy Feet!'}));

// Redirect to sneakers route
// app.use('/sneakers', sneakerRoutes);

app.listen(port, ()=>console.log('Hellllooooooo Handsome!', port));