var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');

var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/test');
var Schema = mongoose.Schema;

//this a change


var app = express();

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'index', layoutsDir: __dirname + '/views'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', router);

var userDataSchema = new Schema({
  event: {type: String, required: true},
  startdate: String,
  starttime: String,
  enddate : String,
  endtime : String,
  duration : String,
  description : String,
  author : String,
  dateentered : String

}, {collection: 'user-data'});

var UserData = mongoose.model('UserData', userDataSchema);

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/get-data', function(req, res, next) {
  UserData.find()
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

app.post('/insert', function(req, res, next) {
  var item = {
    event : req.body.event,
    startdate : req.body.startdate,
    starttime : req.body.starttime,
    enddate: req.body.enddate,
    endtime : req.body.endtime,
    duration : req.body.duration,
    description :req.body.description,
    author : req.body.author,
    dateentered : req.body.dateentered

  };

  var data = new UserData(item);
  data.save();

  res.redirect('/');
});

app.post('/update', function(req, res, next) {
  var id = req.body.id;

  UserData.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.event = req.body.event;
    doc.startdate = req.body.startdate;
    doc.starttime = req.body.starttime;
    doc.enddate= req.body.enddate;
    doc.endtime = req.body.endtime;
    doc.duration = req.body.duration;
    doc.description = req.body.description;
    doc.author = req.body.author;
    doc.dateentered = req.body.dateentered;
    doc.save();
  })
  res.redirect('/');
});

app.post('/delete', function(req, res, next) {
  var id = req.body.id;

  UserData.findByIdAndRemove(id).exec();
  res.redirect('/');
});


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


module.exports = app;
