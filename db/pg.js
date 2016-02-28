var pg                = require('pg');
var connectionString  = "postgres://PeterNguyen:pita@localhost/sneakers";           // hide the password!!
var session           = require('express-session');
var bcrypt            = require('bcrypt');
var salt              = bcrypt.genSaltSync(10);   // encrypts pw 10 layers deep

// User Authenication & Authorization
// need to query for all sneakers with member_id = user_id = sneaker_id
function loginUser(req,res,next) {
  console.log('logging in user');
  console.log(req.body);
  pg.connect(connectionString, function(err,client,done){
    if(err){    done();
                return res.status(500).json({ success: false, data: err}); }

    var query = client.query("SELECT * FROM members WHERE email LIKE ($1);", [req.body.email],
      function(err, results){
        console.log(results.rows);
        done();
        if(err){ return console.error('error running query', err); }
        if(results.rows.length === 0){
          console.log('im here');
          res.render('./users/error.ejs', { data: req.body })
          // next();
          // res.status(204).json({ success: true, data: 'no content'});
        } else if(bcrypt.compareSync(req.body.password, results.rows[0].password_digest)){    // checks & verifies user password
          res.rows = results.rows[0];
          next();
        }
      })
  })
}

// Encrypts password
function createSecure(email, password, callback) {      // hashing password given by user at sign up                                  
  bcrypt.genSalt(function(err,salt){
    bcrypt.hash(password, salt, function(err,hash){
      callback(email, hash);                            // saves user to database with hashed password
    })
  })
}

// Add new member to users table    -- now, member_id = user_id
function addUser(name, shoe_size, balance){
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();
              return res.status(500).json({ success: false, data: err}); }

    var query = client.query("INSERT INTO users(name, shoe_size, balance) VALUES ($1,$2,$3);", [name, shoe_size, balance], 
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }
    })
  })
}

// Create a New Member
function createUser(req, res, next) {
  createSecure(req.body.email, req.body.password, saveUser);    // encrypt password
  addUser(req.body.name, req.body.shoe_size, req.body.balance); // add new member to users table

  function saveUser(email, hash){
    pg.connect(connectionString, function(err,client,done){
      if(err){  done();
                return res.status(500).json({ success: false, data: err}); }

      var query = client.query("INSERT INTO members(email, password_digest) VALUES ($1,$2);", [email, hash], 
        function(err, results){
          done();
          if(err){ return console.error('error running query', err); }
          next();
      })
    })
  }
}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
