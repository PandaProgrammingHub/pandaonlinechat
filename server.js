var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var session = require("client-sessions");
var nodemailer = require("nodemailer");
var fs = require("fs");
var url = require("url");
//var session = require('express-session');
/*var RedisStore = require('connect-redis')(session);
var sessionStore = new RedisStore();
var cookieParser = require('cookie-parser');
var socketHandshake = require('socket.io-handshake');
*/
/*------------Encrypt and decrypt password------------*/
var crypto = require("crypto"),
  algorithm = "aes-256-ctr",
  password = "d6F3Efeq";

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}
function baseUrl(req) {
  return url.format({
    protocol: req.protocol,
    hostname: req.hostname,
  });
}

function randomKey() {
  var code = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 20; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return code;
}
var email_html = "";
fs.readFile("./email.html", function (err, html) {
  if (err) {
    throw err;
  } else {
    email_html = html;
  }
});
function mailSend(to_email) {
  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "pandaonlinechat@gmail.com", // Gmail email id
      pass: "iloveyoumom@123", // Gmail password
    },
  });

  var mailOptions = {
    from: "Panda Online Chat<pandaonlinechat@gmail.com>", // sender address
    to: to_email,
    bcc: "pandaprogramminghub@gmail.com", // list of receivers
    subject: "Panda Online Chat Successfully Registrations", // Subject line
    //text: 'Panda Online Chat Email Varification hey.....', //, // plaintext body
    html: email_html, // You can choose to send an HTML body instead
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      //res.json({yo: 'error'});
    } else {
      console.log("Message sent: " + info.response);
      //res.json({yo: info.response});
    }
  });
}

/*var hw = encrypt("hello world");
console.log(hw+"\n");
// outputs hello world 
console.log(decrypt(hw));
*/
//console.log(decrypt("55dc87c47427"));
/*io.use(socketHandshake({store: sessionStore, key:'sid', secret:'secret', parser:cookieParser()}));*/
app.use(
  session({
    cookieName: "session",
    secret: "eg[isfd-8yF9-7w2315df{}+Ijsli;;to8",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true,
  })
);
/*app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));*/

/*io.use(function(socket, next){
  if (socket.request.headers.cookie) return next();
  next(new Error('Authentication error'));
});*/

var connection = mysql.createConnection({
  //  host     : 'sql6.freemysqlhosting.net',
  //  user     : 'sql6138056',
  //  password : 'JvKHRHR1Bq',
  //  database : 'sql6138056'
  host: "localhost",
  user: "root",
  password: "root",
  database: "panda_chat_db",
});

connection.connect(function (err) {
  if (!err) {
    console.log("Database is connected ...");
  } else {
    console.log("Error connecting database ...");
  }
});

// Initialize appication with route / (that means root of the application)
app.get("/", function (req, res) {
  if (req.session && req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

app.get("/messages", function (req, res) {
  if (req.session && req.session.user) {
    app.use(express.static(path.join(__dirname)));
    res.sendFile(path.join(__dirname, "messages.html"));
  } else {
    res.redirect("/login");
  }
});
app.get("/dashboard", function (req, res) {
  if (req.session && req.session.user) {
    app.use(express.static(path.join(__dirname)));
    res.sendFile(path.join(__dirname, "dashboard.html"));
  } else {
    res.redirect("/login");
  }
});
app.get("/login", function (req, res) {
  if (req.session && req.session.user) {
    res.redirect("/dashboard");
  } else {
    app.use(express.static(path.join(__dirname)));
    res.sendFile(path.join(__dirname, "login.html"));
  }
});

app.get("/signup", function (req, res) {
  app.use(express.static(path.join(__dirname)));
  res.sendFile(path.join(__dirname, "signup.html"));
});

app.get("/logout", function (req, res) {
  var up_online_query =
    "UPDATE  `user` SET  `online` =  'n' WHERE  `email` =  '" +
    req.session.user +
    "'";
  connection.query(up_online_query, function (err, rows, fields) {
    if (err) throw err;
  });
  req.session.reset();
  res.redirect("/");
  //req.session.destroy();
});
app.get("/account-activation", urlencodedParser, function (req, res) {
  var authCode = req.query.authCode;
  //console.log(req.query.authCode);
  var account_activation_query =
    "UPDATE  `user` SET  `activate` =  '1' WHERE `activationCode`= '" +
    authCode +
    "'";
  connection.query(account_activation_query, function (err, rows, fields) {
    if (err) throw err;
  });
  //req.session.reset();
  res.redirect("/dashboard");
  //req.session.destroy();
});
app.post("/resendactivationlink", urlencodedParser, function (req, res) {
  var authCode = randomKey();
  var varification_link =
    baseUrl(req) + "/account-activation?authCode=" + authCode;
  mailSend(req.session.user, varification_link);
  res.send({ message: "mailsendsuccessfully" });
  //req.session.destroy();
});

app.post("/login", urlencodedParser, function (req, res) {
  if (req.session && req.session.user) {
    res.redirect("/dashboard");
  } else {
    var users = [];
    var pass = encrypt(req.body.password);
    var query =
      "SELECT * FROM user WHERE email = '" +
      req.body.email +
      "' AND password = '" +
      pass +
      "'";
    connection.query(query, function (err, rows, fields) {
      //res.redirect('/index');
      if (err) throw err;
      if (rows.length == 0) {
        res.redirect("/login");
        io.sockets.on("connection", function (socket) {
          io.emit("wronglogincredential", { message: "wronglogincredential" });
        });
      } else {
        io.set("session", req.body.email);
        req.session.user = req.body.email;
        var updateqry =
          "UPDATE  `user` SET  `online` =  'y' WHERE  `email` =  '" +
          req.session.user +
          "'";
        connection.query(updateqry, function (err, updateOnline, fields) {
          if (err) throw err;
        });

        //console.log(session);
        res.redirect("/dashboard");
        //io.emit('login', {message: 'success'});
      }
    });
  }
});

app.post("/signup", urlencodedParser, function (req, res) {
  var users = [];
  var pass = encrypt(req.body.password);
  var authCode = randomKey();
  //var pass = req.body.password;
  //console.log(pass);
  var emailcheckqry =
    "SELECT * FROM user WHERE email = '" + req.body.email + "'";
  connection.query(emailcheckqry, function (err, emailcheckrows, fields) {
    if (err) throw err;
    if (emailcheckrows.length == 0) {
      var query =
        "INSERT INTO  `user` (`id`, `fname`, `lname`, `email`, `password`, `image`, `create_at`, `online`,`activate`,`activationCode`) VALUES (NULL, '" +
        req.body.fname +
        "', '" +
        req.body.lname +
        "', '" +
        req.body.email +
        "', '" +
        pass +
        "', '', CURRENT_TIMESTAMP, 'y','0','" +
        authCode +
        "')";
      connection.query(query, function (err, rows, fields) {
        //res.redirect('/index');
        if (err) throw err;
        if (rows.length == 0) {
          //io.emit('login', {message:'notsuccess',session:''});
        } else {
          io.set("session", req.body.email);
          req.session.user = req.body.email;
          var updateqry =
            "UPDATE  `user` SET  `online` =  'y' WHERE  `email` =  '" +
            req.session.user +
            "'";
          connection.query(updateqry, function (err, updateOnline, fields) {
            if (err) throw err;
          });
          // var varification_link = baseUrl(req)+'/account-activation?authCode='+authCode;
          mailSend(req.session.user);
          res.redirect("/dashboard");
        }
      });
    } else {
      res.redirect("/login");
      io.sockets.on("connection", function (socket) {
        io.emit("emailidexit", { message: "emailidexit" });
      });
    }
  });
});

app.post("/getAllUsers", function (req, res) {
  if (req.session && req.session.user) {
    var qry = "SELECT * FROM user";
    connection.query(qry, function (err, rs, fields) {
      if (err) throw err;
      if (rs.length == 0) {
        res.send({
          message: "noUserAvailable",
          getUserCollections: rs,
          currentUserinfo: userinfo,
        });
      } else {
        var userqry =
          "SELECT * FROM user WHERE email = '" + req.session.user + "'";
        connection.query(userqry, function (err, userinfo, fields) {
          if (err) throw err;
          if (userinfo.length > 0) {
            res.send({
              message: "userAvailable",
              getUserCollections: rs,
              currentUserinfo: userinfo,
            });
          } else {
            console.log("No User Found");
          }
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/getWallStatusPost", function (req, res) {
  if (req.session && req.session.user) {
    //console.log("session id= "+req.session.user);
    var userqry = "SELECT * FROM user WHERE email = '" + req.session.user + "'";
    connection.query(userqry, function (err, userinf, fields) {
      if (err) throw err;
      if (userinf.length > 0) {
        //console.log("serr");
        for (var i = 0; i < userinf.length; i++) {
          var qry =
            "SELECT * FROM wall_status_post WHERE user_id = '" +
            userinf[i].id +
            "'";
          connection.query(qry, function (err, rs, fields) {
            if (err) throw err;
            if (rs.length >= 0) {
              res.send({
                message: "userAvailable",
                getWallStatusCollections: rs,
                currentUserinf: userinf,
              });
            }
          });
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/startConversionWithUser", urlencodedParser, function (req, res) {
  if (req.session && req.session.user) {
    var to_id = req.body.to_id;
    var from_id = req.body.from_id;

    //console.log(req.body);

    var qry = "SELECT * FROM user WHERE id = '" + to_id + "'";
    connection.query(qry, function (err, to_userinfo, fields) {
      if (err) throw err;
      if (to_userinfo.length > 0) {
        var chatqry =
          "SELECT * FROM chat WHERE CASE  WHEN from_id = '" +
          from_id +
          "' THEN to_id ='" +
          to_id +
          "' WHEN from_id = '" +
          to_id +
          "' THEN to_id ='" +
          from_id +
          "' END  ORDER BY `sent_on` ";
        console.log("chatqry=>", chatqry);
        connection.query(chatqry, function (err, chatmessage, fields) {
          if (err) throw err;
          if (chatmessage.length >= 0) {
            res.send({
              message: "conversionAvailable",
              toUserInfo: to_userinfo,
              conversionMessage: chatmessage,
            });
            //io.emit('startConversionWithUser', to_userinfo,chatmessage);
            //console.log(chatmessage);
          }
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

// Register events on socket connection
io.on("connection", function (socket) {
  socket.on("chatMessage", function (from, to, msg) {
    var query =
      'INSERT INTO  `chat` (`id`, `from_id`, `to_id`, `message`) VALUES (NULL, "' +
      from +
      '", "' +
      to +
      '", "' +
      connection.escape(msg) +
      '")';
    connection.query(query, function (err, rows, fields) {
      if (err) throw err;
    });
    io.emit("chatMessage", from, to, msg);
  });

  socket.on("wallstatusPost", function (user_id, msg) {
    var query =
      'INSERT INTO  `wall_status_post` (`id`, `user_id`, `status`) VALUES (NULL, "' +
      user_id +
      '", "' +
      connection.escape(msg) +
      '")';
    connection.query(query, function (err, rows, fields) {
      if (err) throw err;
    });
    io.emit("wallstatusPost", user_id, msg);
  });

  socket.on("notifyUser", function (user, notify_to) {
    io.emit("notifyUser", user, notify_to);
  });

  /*socket.on('login', function (data) {
    var query = "SELECT * FROM user WHERE name = '" + data.userLogin + "' AND password = '" + data.userPassword + "'";
    connection.query(query, function(err, rows, fields) {
      if (err) throw err;
      if(rows.length == 0) {
        io.emit('login', {message:'Wrong login or password', session: ""});
      } else {
        io.set('session', data.userLogin);
        io.emit('login', {message: 'success', session: data.userLogin});
      }
    });
  });*/
});

// Listen application request on port 3000
http.listen(8080, function () {
  console.log("listening on *:8080");
});
