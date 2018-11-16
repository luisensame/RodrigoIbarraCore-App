var express = require('express');
//mongoose provider to connect mongodb
var mongoose = require('mongoose');
var log4js = require('log4js');

var apiRouterOpen = require("./routes/api/apiRouterOpen")
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jobProducto = require('./jobs/jobProducto');

//Routes
var routes = require('./routes/index');
var apiRoutes = require('./routes/api');

var app = express();

//config db file
var config = require('./config');

log4js.configure(config.log4j);
var log = log4js.getLogger('sell-it');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(log4js.connectLogger(log4js.getLogger('http'), {level: 'auto'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middleware CORS -- configuracion de la app para el control de CORS sobre request
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-type, Authorization, x-access-token');
  //cache
  //res.setHeader("Cache-Control", 'public, max-age=604800000');//7Dias
  //Vary para proxys
  //res.setHeader("Vary", 'Accept-Encoding');//7Dias
  //Remove value of header
  res.removeHeader("X-Powered-By");

  //if client send request type OPTIONS
  if (req.method === 'OPTIONS') {    
    //send status ok
    return res.status(200).send();
  }
  return next();
});

app.use('/', routes);
app.use('/api', apiRoutes);
app.use('/apilanding', apiRouterOpen)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//custom promise for mongoose
mongoose.Promise = global.Promise;
//set debug mode for operations on mongoose
mongoose.set('debug', config.db['debug']);
//Start connection to mongo with options
mongoose.connect(config.db['uri'], config.db['options']);
var db = mongoose.connection;
db.on('error', function (e){
  log.error('Error connect to mongodb: ', e);
});
db.once('open', function (){
  log.info('Connect to mongodb success');
});


var http = require('http');
var server = http.createServer(app);
server.listen(process.env.PORT || 3000, process.env.IP, function(){
  var addr = server.address();
  log.info("Server listening at", addr.address + ":" + addr.port);  
  log.info('Run app on Env kitchen from config: ', config.env);
});


//module.exports = app;
