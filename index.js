var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var session = require('client-sessions');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

//app.use(express.cookieParser());
//app.use(express.session({secret: '1234567890QWERTY'}));
//app.use(app.router);
var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'panda_chat_api'
 });

connection.connect(function(err){
 if(!err) {
     console.log("Database is connected ...\n");  
 } else {
     console.log("Error connecting database ...\n");  
 }
 });
 
// Initialize appication with route / (that means root of the application)
app.get('/', function(req, res){
  if (req.session && req.session.user) {
      res.redirect('/dashboard');   
  
  }else{
      res.redirect('/login');   
      
  }
});

app.get('/dashboard', function(req, res){
    app.use(express.static(path.join(__dirname)));
    res.sendFile(path.join(__dirname, '../chat-application', 'dashboard.html'));
});

app.get('/login', function(req, res){
    app.use(express.static(path.join(__dirname)));
    res.sendFile(path.join(__dirname, '../chat-application', 'login.html'));
});

app.get('/signup', function(req, res){
    app.use(express.static(path.join(__dirname)));
    res.sendFile(path.join(__dirname, '../chat-application', 'signup.html'));
});

app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

app.post('/login',urlencodedParser,function(req, res) {
  var query = "SELECT * FROM user WHERE email = '" + req.body.email + "' AND password = '" + req.body.password + "'";
  connection.query(query, function(err, rows, fields) {
  //res.redirect('/index');
  if (err) throw err;
  if(rows.length == 0) {
    io.emit('login', {message:'notsuccess',session:''});
  } else {

    io.set('session', req.body.email);
    req.session.user = req.body.email;
console.log(rows['id']);
res.redirect('/dashboard');

io.emit('login', {message: 'success',session:rows.id});
}
});
});


app.post('/sign',urlencodedParser,function(req, res) {
  var query = "SELECT * FROM user WHERE email = '" + req.body.email + "' AND password = '" + req.body.password + "'";
  connection.query(query, function(err, rows, fields) {
  //res.redirect('/index');
  if (err) throw err;
  if(rows.length == 0) {
    io.emit('login', {message:'notsuccess',session:''});
  } else {
    io.set('session', req.body.email);
    req.session.user = req.body.email;
//console.log(rows);
res.redirect('/dashboard');

io.emit('login', {message: 'success',session:req.body.email});
}
});
});






 
// Register events on socket connection
io.on('connection', function(socket){ 
  socket.on('chatMessage', function(from, msg){
    io.emit('chatMessage', from, msg);
  });
  socket.on('notifyUser', function(user){
    io.emit('notifyUser', user);
  });

  socket.on('login', function (data) {
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
});

});
 
// Listen application request on port 3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});