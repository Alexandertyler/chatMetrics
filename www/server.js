//server
var express = require('express');
var app = express();
var router = express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

//used for logging requests to the console
var morgan = require('morgan');
app.use(morgan('dev'));

//============== Mongodb Load =============
//Connect to the DB and load our schema
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chatMetrics');
var Chatlog = require('./app/models/chatlog');
var Toplogs = require('./app/models/toplogs');

//Serve all the static files
app.use(express.static(__dirname + '/app/static'));

//=============== API ==============
router.use(function(req, res, next) {
  console.log('Something is happening');
  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'Top level api' })
});

router.route('/chatlog')
  .post(function(req, res) {
    var chatlog = new Chatlog(); //a new instance of a chatlog from the schema
    
    console.log(req.body);
    chatlog.user = req.body.user;
    chatlog.channel = req.body.channel;
    chatlog.message = req.body.message;

    chatlog.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Chatlog created' });
    });
  });

router.route('/toplogs')
  .get(function(req, res) {
    var toplogs = new Toplogs();
    console.log(req.query);
    if (req.query.count) {
      //call db lookup on top COUNT logs
    }
    

    res.json({ message: 'Get recieved'});
  });

//======= Register routes =======
app.use('/api', router)



//============== Serve Angular Index =============
app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.listen(8080);
console.log('App is listening on port 8080');
