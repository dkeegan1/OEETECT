var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/test');
var Schema = mongoose.Schema;

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
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  UserData.find()
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.post('/insert', function(req, res, next) {
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

router.post('/update', function(req, res, next) {
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

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/');
});

module.exports = router;
