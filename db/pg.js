var pg                = require('pg');
var connectionString  = "postgres://PeterNguyen:pita@localhost/sneakers";      

// USE THIS WHEREVER YOU USE THE DATABASE !!
// if(process.env.ENVIRONMENT === 'production'){     // in heroku: add environment = production in config variables
//   var config = process.env.DATABASE_URL;
// } else {                                          // in local  
//   var connectionString = {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS
//   }
// }

var session           = require('express-session');
var bcrypt            = require('bcrypt');
var salt              = bcrypt.genSaltSync(10);   // encrypts pw 10 layers deep

// User Authenication & Authorization
function loginUser(req,res,next) {
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();   return res.status(500).json({ success: false, data: err}); }

    var query = client.query("SELECT * FROM members WHERE email LIKE ($1);", [req.body.email.toLowerCase()],
      function(err, results){   
        done();
        if(err){ return console.error('error running query', err); }
        if(results.rows.length === 0){
          console.log('email does not exist in users db table');
          res.render('./users/login.ejs', { data: 'Oops! This email does not exist!' });
        } else if(bcrypt.compareSync(req.body.password, results.rows[0].password_digest)){    // checks & verifies user password
          res.rows = results.rows[0];
          next();
        } else {
          res.render('./users/login.ejs', { data: 'Invalid email or password. Please try again.' });
        }
      })
  })
}

// Bcrypt password
function createSecure(email, password, callback) {      // hashing password given by user at sign up                                  
  bcrypt.genSalt(function(err,salt){
    bcrypt.hash(password, salt, function(err,hash){
      callback(email, hash);                            // saves user to database with hashed password
    })
  })
}

// Add new member to users table (member_id = user_id)
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
  // verifies if new_user email is unique & not already used by another user
  verifyUniqEmail(req.body.email);      
  // send email and search database for results -> render back to new_user if taken
  // if > 0, return error message and ask to use a different email. otherise, continue to createSecure & addUser


  createSecure(req.body.email, req.body.password.toLowerCase(), saveUser);    // encrypt password
  addUser(req.body.name, req.body.shoe_size, req.body.balance);               // add new member to users table

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

  // Verifies email hasnt been taken yet
  function verifyUniqEmail(email){
    pg.connect(connectionString, function(err,client,done){
      if(err){  done();   return res.status(500).json({ success: false, data: err}); }
      // query for all members where email like '%new_user_email_input'
      var confirmUniqEmail = client.query("SELECT * FROM members WHERE email LIKE ($1);", ['%'+email],
        function(err, results){
          done();
          if(err){ return console.error('error running query', err); }
          
          if(results.rows.length !== 0){ 
            res.render('./users/new_user', { data: 'This email is already in use. Please try again with a different email.' }); 
          } else {  next(); }
      // (!results.rows.length) ? next() : res.render('./users/new', { data: 'This email is already in use. Please try again with a different email.' });
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

    var getUserID = client.query("SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1;", 
      function(err, results){ done() });

    var getUserSneakers = client.query("SELECT * FROM sneakers AS s INNER JOIN inventory AS i ON s.sneaker_id = i.sneaker_id WHERE user_id=($1);", [Uid],
      function(err, results){
        done();
        res.rows = results.rows;
        next();
    });
  })
}

// add to inventory table 
function addInventory(req, res, next){
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();   return res.status(500).json({ success: false, data: err}); }

    console.log('adding to inventory, user_id: ' + req.session.user.member_id);
    console.log('adding to inventory, sneaker_id: ' + req.params.id);

    var addToInventory = client.query("INSERT INTO inventory(user_id, sneaker_id) VALUES ($1,$2);", [req.session.user.member_id, req.params.id], 
      function(err, results){ done(); next(); });
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
        done();
        var sneakerID = results.rows[0].sneaker_id;     // the most recently added sneaker_id 

        // add to inventory table (step3)
        var insertToInventory = client.query("INSERT INTO inventory(user_id, sneaker_id) VALUES ($1,$2);", [Uid, sneakerID],
          function(err, results){ done() });
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
        // eval(pry.it)
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
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();   return res.status(500).json({ success: false, data: err}); }
    
    var removeSneaker = client.query("DELETE FROM inventory WHERE user_id=($1) AND sneaker_id=($2);", [req.session.user.member_id, req.params.id], 
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }
        next();
    });
  })
}

// search sneaker(s)
// Query commands were possible with help from Peter - thank you!!
function searchSneaker(req, res, next){
  var Uid = req.session.user.member_id;
  console.log('searchSneaker: ' + Uid);

  var allResults = [];
  var search = req.query.search.split(' '); // string -> array  ['yeezy', 'FLYKNIT']
  var client = new pg.Client(connectionString);     // create new database connection

  client.on('drain', client.end.bind(client));      // 'drain' (EventListener) - closes database connection

  client.on('end', function() {                     // 'end' (EventListener) - executes when all queries are finished
    res.rows = allResults;
    next();
  });

  search.forEach(function(word){
    var query = client.query("SELECT * FROM sneakers WHERE name ILIKE ($1);", ['%'+word+'%']);
    query.on('row', function(sneaker){        // for each row returned, execute the following function
      allResults.push(sneaker);
    });
  });

  client.connect();       // initializes connection to database
}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.allSneakers = allSneakers;
module.exports.getSneaker = getSneaker;
module.exports.addSneaker = addSneaker;
module.exports.editSneaker = editSneaker;
module.exports.removeSneaker = removeSneaker;
module.exports.searchSneaker = searchSneaker;
module.exports.addInventory = addInventory;























