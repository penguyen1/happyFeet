pry = require('pryjs');
'use strict'
var express         = require('express');
var logger          = require('morgan');
var ejs             = require('ejs');
var path            = require('path');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var session         = require('express-session');             // user authentication
var pgSession       = require('connect-pg-simple')(session);  // allows user login
var pg              = require('pg');
var connectionString = "postgres://PeterNguyen:pita@localhost/sneakers";        // hide the password!

// if(!process.env.PORT){
//   require('dotenv').config();
// }

var db              = require('./db/pg');               // links server.js to pg.js
var app             = express();
var port            = process.env.PORT || 3000;
var sneakerRoutes   = require(path.join(__dirname, '/routes/sneakers'));    // directory path to sneakers.js!
var userRoutes      = require(path.join(__dirname, '/routes/users'));       // directory path to users.js!

app.use(session({
  store: new pgSession({
    pg: pg,
    conString: connectionString,
    tableName: 'session'
  }),
  secret: 'sooosecreetttt',
  resave: false,
  cookie: { maxAge: 30*24*60*60*1000 }    // cookie expires in 30 days
}));

app.use( logger('dev') );
app.use( bodyParser.urlencoded({ extended: false }) );    // parses POST methods from forms
app.use( bodyParser.json() );
app.use( methodOverride('_method') );                     // allows PUT & DELETE methods
app.set( 'views', './views' );                            // root directory for ejs files
app.set( 'view engine', 'ejs' );
app.use(express.static(path.join(__dirname, 'public')));  // static route to css files
                                  // semantic-UI = 'semantic'
// Homepage Route
app.get('/', (req,res)=>res.render('users/login', { data: 'Not a member??' }));

// Redirect to RESTful routes
app.use('/sneakers', sneakerRoutes);
app.use('/users', userRoutes);

app.listen(port, ()=>console.log('Hellllooooooo Handsome!', port));

















