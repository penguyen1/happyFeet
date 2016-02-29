var pg                = require('pg');
var connectionString  = "postgres://PeterNguyen:pita@localhost/sneakers";           // hide the password!!
var session           = require('express-session');
var bcrypt            = require('bcrypt');
var salt              = bcrypt.genSaltSync(10);   // encrypts pw 10 layers deep

// User Authenication & Authorization
function loginUser(req,res,next) {
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();   return res.status(500).json({ success: false, data: err}); }

    var query = client.query("SELECT * FROM members WHERE email LIKE ($1);", [req.body.email],
      function(err, results){
        console.log('\nloginUser results.rows: ');
        console.log(results.rows);
        done();
        if(err){ return console.error('error running query', err); }
        if(results.rows.length === 0){
          console.log('email does not exist in users db table');
          // res.render('./users/error.ejs', { data: req.body })         // redirect visitor to error page that redirects to login page
          res.render('./users/login.ejs', { data: 'Oops! This email does not exist!' });
        } else if(bcrypt.compareSync(req.body.password, results.rows[0].password_digest)){    // checks & verifies user password
          res.rows = results.rows[0];
          console.log('loginUser (passwords matched) res.rows: ');
          console.log(res.rows);
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
    if(err){  done();    return res.status(500).json({ success: false, data: err}); }
    var query = client.query("INSERT INTO users(name, shoe_size, balance) VALUES ($1,$2,$3);", [name, shoe_size, balance], 
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }
    })
  })
}

// Create a New Member
function createUser(req, res, next) {
  // query users table if this email already exists
  // if yes, return error message and ask to use a different email
  // if no, continue
    // if(results.rows.length > 0){
    //   console.log('This email is already taken. Please register with a different email!');
    //   res.render('./users/error.ejs', { data: req.body })
    // }

  // arent passwords supposed to be case-sensitive? wouldnt .toLowerCase() conflict with that ??
  createSecure(req.body.email, req.body.password.toLowerCase(), saveUser);    // encrypt password
  addUser(req.body.name, req.body.shoe_size, req.body.balance); // add new member to users table

  function saveUser(email, hash){
    pg.connect(connectionString, function(err,client,done){
      if(err){  done();   return res.status(500).json({ success: false, data: err}); }

      var query = client.query("INSERT INTO members(email, password_digest) VALUES ($1,$2);", [email, hash], 
        function(err, results){
          done();
          if(err){ return console.error('error running query', err); }
          next();
      })
    })
  }
}

// need to query for all sneakers with member_id = user_id = sneaker_id
function allSneakers(req, res, next){
  var Uid = req.session.user.member_id;
  console.log('allSneakers: ' + Uid);

  // query for all sneakers where member_id = user_id AND user_id = sneaker_id (join users, inventory & sneakers)
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();   return res.status(500).json({ success: false, data: err}); }

    var getUserSneakers = client.query("SELECT * FROM sneakers AS s INNER JOIN inventory AS i ON s.sneaker_id = i.sneaker_id WHERE user_id=($1);", [Uid],
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }
        res.rows = results.rows;
        next();
      })
  })
}

// add to inventory table 
function addInventory(user_id, sneaker_id){
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();   return res.status(500).json({ success: false, data: err}); }
    
    var addToInventory = client.query("INSERT INTO inventory(user_id, sneaker_id) VALUES ($1,$2);", [user_id, sneaker_id], 
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }
    });
  })
}

// add sneaker
function addSneaker(req, res, next){
  var Uid = req.session.user.member_id;
  console.log('addSneaker: ' + Uid);
  console.log(req.body);

  pg.connect(connectionString, function(err,client,done){
    if(err){  done();   return res.status(500).json({ success: false, data: err}); }
    // insert into sneakers table (step1)
    var addToSneakers = client.query("INSERT INTO sneakers(name, brand_id, retail_price, resale_price, description, img_url) VALUES ($1,$2,$3,$4,$5,$6);", 
      [req.body.name, req.body.brand_id, req.body.retail_price, req.body.resale_price, req.body.description, req.body.img_url], 
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }
    });

    // get most recent sneaker_id from sneakers table (step2)
    var lastSneakerID = client.query("SELECT sneaker_id FROM sneakers ORDER BY sneaker_id DESC LIMIT 1;",
      function(err, results){
        var sneakerID = results.rows[0].sneaker_id; 
        addInventory(Uid, sneakerID);     // insert into inventory table (step3)
        done();
        if(err){ return console.error('error running query', err); }
        next();
    });
  })
}

// get sneaker profile 
function getSneaker(req, res, next){
  var Uid = req.session.user.member_id;
  console.log('getSneaker: ' + Uid);

  // query sneaker_id from sneakers where sneaker_id = req.params.id (route that called this function)
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();   return res.status(500).json({ success: false, data: err}); }

    var getSneaker = client.query("SELECT users.shoe_size, brand.name AS brand_name, s.sneaker_id, s.name AS snkr_name," +
                                  " s.retail_price, s.resale_price, s.description, s.img_url FROM sneakers AS s " +
                                  "INNER JOIN brand ON brand.brand_id = s.brand_id " +
                                  "INNER JOIN inventory ON inventory.sneaker_id = s.sneaker_id " +
                                  "INNER JOIN users ON inventory.user_id = users.user_id " +
                                  "WHERE s.sneaker_id=($1);", [req.params.id],
      function(err, results){ 
        done();
        if(err){ return console.error('error running query', err); }
        res.rows = results.rows;
        next();
      })
  })
}

// edit sneaker
function editSneaker(req, res, next){
  var Uid = req.session.user.member_id;
  console.log('editSneaker: ' + Uid);
  
  // update sneakers table set col1=($1), col2=($2), etc. where sneaker_id=($7)
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();   return res.status(500).json({ success: false, data: err}); }
    // insert into sneakers table (step1)
    var updateSneaker = client.query("UPDATE sneakers SET name=($1), brand_id=($2), retail_price=($3), resale_price=($4), description=($5), img_url=($6) WHERE sneaker_id=($7);",
      [req.body.name, req.body.brand_id, req.body.retail_price, req.body.resale_price, req.body.description, req.body.img_url, req.params.id], 
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }
        next();
    });
  })
}

// remove sneaker
function removeSneaker(req, res, next){
  var Uid = req.session.user.member_id;
  console.log('removeSneaker: ' + Uid);
  // delete from inventory table where sneaker_id=($1) AND user_id=($2)
}

// search sneaker 
function searchSneaker(req, res, next){
  var Uid = req.session.user.member_id;
  console.log('searchSneaker: ' + Uid);
  // convert search input string into an array & split by white spaces(?)
  // for each word, query sneakers table where sneaker.name LIKE ($1), [search[i]], function(err, results){
    // get results.rows.length 
    // for( var i in results.rows ){ append results.rows[i] into res.rows }
  // }
  // next();        -- where do we put done()?
}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.allSneakers = allSneakers;
module.exports.getSneaker = getSneaker;
module.exports.addSneaker = addSneaker;
module.exports.editSneaker = editSneaker;
module.exports.removeSneaker = removeSneaker;
module.exports.searchSneaker = searchSneaker;
























