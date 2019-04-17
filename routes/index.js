var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var addSubtractDate = require("add-subtract-date");
mongoose.connect('localhost:27017/test');
var Schema = mongoose.Schema;
var test;

/*var d = new Date(2018, 11, 20);
var f = new Date(2019, 11, 20);
console.log(addSubtractDate.subtract(d,f,"minutes"));*/

var userDataSchema = new Schema({
  event: {type: String, required: true},
  startdate: String,
  enddate : String,
  duration: Number,
  description : String,
  author : String,
  date : String
});
//, {collection: 'UserData'}
//test.UserData.aggregate([{$project: {duration: {$subtract:["$enddate","$startdate" ]}}}])

var UserData = mongoose.model('UserData', userDataSchema);
var UserData = mongoose.model('UserData', userDataSchema);
var UserData = mongoose.model('UserData', userDataSchema);
var UserData = mongoose.model('UserData', userDataSchema);


/* GET home page. */
router.get('/', function(req, res, next) { //Login Page
  res.render('index');
});
router.get('/Welcome', function(req, res, next) { //welcome Page have to do this one yet
  res.render('Wel');
});
router.get('/enter', function(req, res, next) { //Insert Page
  res.render('_index');
});
router.get('/get-data', function(req, res, next) { //Get Data Page
  UserData.find()
      .then(function(doc) {
        res.render('home', {items: doc});
      });
});

router.post('/insert', function(req, res, next) {
  var item = {
    event : req.body.event,
    startdate : req.body.startdate,
    enddate: req.body.enddate,
    duration : req.body.duration,
    description :req.body.description,
    author : req.body.author,
    date : req.body.date

  };

  var data = new UserData(item);
  data.save();

  res.redirect('/Welcome');
});

router.post('/update', function(req, res, next) {
  var id = req.body.id;

  UserData.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.event = req.body.event;
    doc.startdate = req.body.startdate;
    //doc.starttime = req.body.starttime;
    doc.enddate= req.body.enddate;
    //doc.endtime = req.body.endtime;
    doc.duration = req.body.duration;
    doc.description = req.body.description;
    doc.author = req.body.author;
    doc.date = req.body.date;
    doc.save();
  })
  res.redirect('/Welcome');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/Welcome');
});

module.exports = router;
