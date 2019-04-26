var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var addSubtractDate = require("add-subtract-date");
var csrf = require('csurf');
var csrfProtection = csrf();
mongoose.connect('localhost:27017/test');
var Schema = mongoose.Schema;
var assert = require('assert');
var passport = require('passport');
//var result =3;


var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    sumDuration(db, () => {
        db.close();
    });
});
var sumDuration = (db, callback) => {
 //var OEE = [ { $project:{_id:0, OEE:{$trunc:[ {$multiply:[{$divide:[{$sum:[ "$duration"] },10080]},100]}]}}}];
 //,{ $out : "Results" }
  var agr = [{$group: { total: {$sum: "$duration"},_id:"Total Duration"}}];// adds all the duration and creates collection Results
  var Mechanical = [{ $match: {$or: [ { event: "Mechanical" }] }},{ $group: {_id: "Mechanical", total: {$sum: "$duration" } }}]; //adds all Mechanical
  var CIP = [{ $match: {$or: [{ event: "CIP" }] }},{ $group: {_id: "CIP", total: { $sum: "$duration" } }}];//adds all cips
  var List = [{ $match: {$or: [{ event: "List Change" }] }},{ $group: {_id: "List Change", total: { $sum: "$duration" } }}]; //adds all list changes
 //result = 3;
    var cursor = db.collection('dryer1').aggregate(agr).toArray( (err, res) => { //jason object
       assert.equal(err, null);
       console.log("DURATION CALCULATIONS");

      result  = res;
       var myJSON = JSON.stringify(result);

       router.get('/graph', function(req, res, next) { //welcome Page have to do this one yet
            // console.log(result);
             //res.render('D1graph', {result:JSON.parse(result)
              res.render('D1graph', {result: myJSON
       });
    });
  });
}

//var db.getCollection('dryer1').aggregate(
//[{$match: {} },{$group: {_id:"event", total: {$sum: "$duration"}}}])

var userDataSchema = new Schema({
  event: {type: String, required: true},
  startdate: String,
  enddate : String,
  duration: String,
  description : String,
  author : String,
  date : String
});
//, {collection: 'UserData'}
var Dryer1 = mongoose.model('Dryer1', userDataSchema);
var Dryer2 = mongoose.model('Dryer2', userDataSchema);
var Evap1 = mongoose.model('Evapartor1', userDataSchema);
var Evap2 = mongoose.model('Evapartor2', userDataSchema);

router.use(csrfProtection);
/* GET home page. */
router.get('/user/signup', function(req, res, next) { //Login Page
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages:messages});
});
router.post('/user/signup',passport.authenticate('local.signup',{
  successRedirect: '/Welcome',
  failureRedirect: '/user/signup',
  failureFlash: true
}));


router.get('/', function(req, res, next) { //Login Page
  res.render('index');
});
router.get('/Welcome', function(req, res, next) { //welcome Page have to do this one yet
      res.render('Wel');
});
router.get('/enterD1', function(req, res, next) {
   //Insert Page
  res.render('insert/Dryer1');
});
/*router.get('/graph', function(req, res, next) {
   //Insert Page
  res.render('D1graph');
});*/
router.get('/enterD2', function(req, res, next) { //Insert Page
  res.render('insert/Dryer2');
});
router.get('/enterE1', function(req, res, next) { //Insert Page
  res.render('insert/Evap1');
});
router.get('/enterE2', function(req, res, next) { //Insert Page
  res.render('insert/Evap2');
});
router.get('/getD1', function(req, res, next) { //Get Data Page
  Dryer1.find()
      .then(function(doc) {
        res.render('display/D1', {items: doc});
      });
});
router.get('/getD2', function(req, res, next) { //Get Data Page
  Dryer2.find()
      .then(function(doc) {
        res.render('display/D2', {items: doc});
      });
    });

router.get('/getE1', function(req, res, next) { //Get Data Page
  Evap1.find()
      .then(function(doc) {
        res.render('display/E1', {items: doc});
      });
    });

router.get('/getE2', function(req, res, next) { //Get Data Page
  Evap2.find()
      .then(function(doc) {
        res.render('display/E2', {items: doc});
      });
    });

router.post('/insertD1', function(req, res, next) {
  var item = {
    event : req.body.event,
    startdate : req.body.startdate,
    enddate: req.body.enddate,
    duration : req.body.duration,
    description :req.body.description,
    author : req.body.author,
    date : req.body.date
  };
  var data = new Dryer1(item);
  data.save();
  res.redirect('/Welcome');
});
router.post('/insertD2', function(req, res, next) {
  var item = {
    event : req.body.event,
    startdate : req.body.startdate,
    enddate: req.body.enddate,
    duration : req.body.duration,
    description :req.body.description,
    author : req.body.author,
    date : req.body.date
  };
  var data = new Dryer2(item);
  data.save();
  res.redirect('/Welcome');
});
router.post('/insertE1', function(req, res, next) {
  var item = {
    event : req.body.event,
    startdate : req.body.startdate,
    enddate: req.body.enddate,
    duration : req.body.duration,
    description :req.body.description,
    author : req.body.author,
    date : req.body.date
  };
  var data = new Evap1(item);
  data.save();
  res.redirect('/Welcome');
});
router.post('/insertE2', function(req, res, next) {
  var item = {
    event : req.body.event,
    startdate : req.body.startdate,
    enddate: req.body.enddate,
    duration : req.body.duration,
    description :req.body.description,
    author : req.body.author,
    date : req.body.date
  };
  var data = new Evap2(item);
  data.save();
  res.redirect('/Welcome');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  Dryer1.findByIdAndRemove(id).exec();
  Dryer2.findByIdAndRemove(id).exec();
  Evap1.findByIdAndRemove(id).exec();
  Evap2.findByIdAndRemove(id).exec();
  res.redirect('/Welcome');
});

module.exports = router;
