var pg                = require('pg');
var connectionString  = "postgres://PeterNguyen:pita@localhost/test";
var session           = require('express-session');
var bcrypt            = require('bcrypt');
var salt              = bcrypt.genSaltSync(10);   // encrypts pw 10 layers deep

function loginUser(req,res,next) {
  pg.connect(connectionString, function(err,client,done){
    if(err){    done();
                return res.status(500).json({ success: false, data: err}); }

    var query = client.query("SELECT * FROM users WHERE email LIKE ($1);", [req.body.email],
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }

        if(results.rows.length === 0){
          res.status(204).json({ success: true, data: 'no content'});
        } else if(bcrypt.compareSync(req.body.password, results.rows[0].password_digest)){
          res.rows = results.rows[0];
          next();
        }
      })
  })
}

function createSecure(email, password, callback) {      // hashing password given by user at sign up
  // eval(pry.it);                                     
  bcrypt.genSalt(function(err,salt){
    bcrypt.hash(password, salt, function(err,hash){
      callback(email, hash);                            // saves user to database with hashed password
    })
  })
}

function createUser(req, res, next) {
  createSecure(req.body.email, req.body.password, saveUser);

  function saveUser(email, hash){
    pg.connect(connectionString, function(err,client,done){
      if(err){    done();
                  return res.status(500).json({ success: false, data: err}); }

      var query = client.query("INSERT INTO users(email, password_digest) VALUES ($1, $2);", [email, hash], 
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
