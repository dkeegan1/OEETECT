var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var addSubtractDate = require("add-subtract-date");
var csrf = require('csurf');
var csrfProtection = csrf();
var Schema = mongoose.Schema;
var assert = require('assert');
var passport = require('passport');
mongoose.connect('localhost:27017/test');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    sumDuration(db, () => {
        db.close();
    });
});
var sumDuration = (db, callback) => {
  var agr = [{$group: { total: {$sum: "$duration"},_id:"Total Duration"}},{ $out : "Results" }];// adds all the duration and creates collection Results
  var Mechanical = [{ $match: {$or: [ { event: "Mechanical" }] }},{ $group: {_id: "Mechanical", total: {$sum: "$duration" } }},{ $out : "Mechanical" }]; //adds all Mechanical
  var CIP = [{ $match: {$or: [{ event: "CIP" }] }},{ $group: {_id: "CIP", total: { $sum: "$duration" } }},{ $out : "CIP" }];//adds all cips
  var List = [{ $match: {$or: [{ event: "List Change" }] }},{ $group: {_id: "List_Change", total: { $sum: "$duration" } }},{ $out : "ListChange" }]; //adds all list changes
  var Scheduale = [{ $match: {$or: [{ event: "Schedualed Downtime" }] }},{ $group: {_id: "Schedualed Downtime", total: { $sum: "$duration" } }},{ $out : "SchedualedDowntime" }];

 var cursor = db.collection('dryer1').aggregate(agr).toArray( (err, res) => {
    assert.equal(err, null);
 });
 var cursor = db.collection('dryer1').aggregate(Mechanical).toArray( (err, res) => {
    assert.equal(err, null);
 });
 var cursor = db.collection('dryer1').aggregate(CIP).toArray( (err, res) => {
    assert.equal(err, null);
 });
 var cursor = db.collection('dryer1').aggregate(List).toArray( (err, res) => {
    assert.equal(err, null);
 });
 var cursor = db.collection('dryer1').aggregate(Scheduale).toArray( (err, res) => {
   console.log(res);
    assert.equal(err, null);
 });
};

/*MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("test");
  dbo.collection('Results').aggregate([
    { $lookup:
       {
         from: 'Mechanical',
         localField: '_id',
         foreignField: 'total',
         as: 'Added'
       }
     }

    ]).toArray(function(err, res) {
    if (err) throw err;
    console.log(JSON.stringify(res));
    db.close();
  });
});*/


router.get('/graph', function(req, res, next) { //welcome Page have to do this one yet
    var resultArray = [];
    mongodb.connect(url,function(err, db){
      assert.equal(null, err);
      var cursor = db.collection('Results').find();
      cursor.forEach(function(doc, err){
        assert.equal(null, err);
        resultArray.push(doc);
      }, function(){
        db.close();
        res.render('graphs/D1graph',{items: resultArray});
      });
    });
});
router.get('/mechanical', function(req, res, next) { //welcome Page have to do this one yet
    var resultArray = [];
    mongodb.connect(url,function(err, db){
      assert.equal(null, err);
      var cursor = db.collection('Mechanical').find();
      cursor.forEach(function(doc, err){
        assert.equal(null, err);
        resultArray.push(doc);
      }, function(){
        db.close();
        res.render('graphs/Mech',{items: resultArray});
      });
    });
});
router.get('/cip', function(req, res, next) { //welcome Page have to do this one yet
    var resultArray = [];
    mongodb.connect(url,function(err, db){
      assert.equal(null, err);
      var cursor = db.collection('CIP').find();
      cursor.forEach(function(doc, err){
        assert.equal(null, err);
        resultArray.push(doc);
      }, function(){
        db.close();
        res.render('graphs/Cip',{items: resultArray});
      });
    });
});
router.get('/ListChange', function(req, res, next) { //welcome Page have to do this one yet
    var resultArray = [];
    mongodb.connect(url,function(err, db){
      assert.equal(null, err);
      var cursor = db.collection('ListChange').find();
      cursor.forEach(function(doc, err){
        assert.equal(null, err);
        resultArray.push(doc);
      }, function(){
        db.close();
        res.render('graphs/ListChange',{items: resultArray});
      });
    });
});
router.get('/Scheduale', function(req, res, next) { //welcome Page have to do this one yet
    var resultArray = [];
    mongodb.connect(url,function(err, db){
      assert.equal(null, err);
      var cursor = db.collection('SchedualedDowntime').find();
      cursor.forEach(function(doc, err){
        assert.equal(null, err);
        resultArray.push(doc);
      }, function(){
        db.close();
        res.render('graphs/Scheduale',{items: resultArray});
      });
    });
});


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

router.get('/user/signup', function(req, res, next) { //Login Page
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages:messages});
});
router.post('/user/signup',passport.authenticate('local.signup',{
  successRedirect: '/Welcome',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/user/signin', function(req, res, next) { //Login Page
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages:messages});
});
router.post('/user/signin',passport.authenticate('local.signin',{
  successRedirect: '/Welcome',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

router.get('/user/logout', function(req, res, next) { //Login Page
  req.logout();
  res.redirect('user/signin');
});

router.get('/', function(req, res, next) { //Login Page
  res.render('Wel');
});

router.get('/enterD1', function(req, res, next) {
   //Insert Page
  res.render('insert/Dryer1');
});

router.get('/enterD2', isLoggedIn, function(req, res, next) { //Insert Page
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/'); //starting page
}
function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
