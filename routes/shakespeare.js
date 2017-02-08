'use strict'

var express = require('express'),
  router = express.Router(),
  twilio = require('twilio'),
  romanceMeter = require('../lib/romance-meter'),
  sonnetGenerator = require('../lib/sonnet-generator'),
  User = require('../models/user'),
  _ = require('underscore');

function twimlMessage (message, media) {
  var output = new twilio.TwimlResponse();

  output.message(function() {
    this.body('Roses are red, Violets are blue, Twilio likes sending nice poems to you.');
    this.media('http://example.com/puppy.jpg');
  });
  return output;
}

function checkBody(body, user, req) {
  var media = '',
    message = '';
  switch (body) {
    case 'help':
      media = './public/images/rules.gif';
      break;
    case 'sonnet':
      media = sonnetGenerator.randomSonnet(user);
      message = `To thine love, ${user.firstName}. Soon you shalt be receiving a sonnet of mine own creation. Share online using #HelpMeShakespeare, to win a Bansky print.`
      break;
    case 'name':
      user.state = 'registering';
      user.save();
      message = `Okay what is thoust first name?`
      break;
    case 'valentine':
      user.state = 'pairing';
      user.save();
      message = `Okay what is thoust valentine's name?`
      break;
    default:
      var response = romanceMeter.check(user, req);
      message = response.message;
      media = response.media;
  }
  return {'media': media, 'message': message}
}

router.post('/incoming/', function (req,res,next) {
  var body = req.body.Body.toLowerCase(),
    userPhone = req.body.From,
    message = 'Roses are red, Violets are blue, Twilio likes sending nice poems to you.',
    media = '';
  res.type('text/html');

  User.findOne({ phone: userPhone })
    .then(function (user) {
      // Check if user is new, or is requesting a sonnet.
      switch (user.state) {
        case 'new':

          message = 'Hello, I am Shakespeare. It would be heavenly to assist ye. First question, what be thy first name?';
          media = './public/images/rules.gif';
          user.state = 'registering';
          user.save();
          break;
        case 'registering':
          message = `Admirable to meet ye ${user.firstName}. Next question, what is thy email address? I shalt only use this to send ye sonnets on your request.`;
          user.firstName = req.body.Body;
          user.state = 'naming';
          user.save();
          break;
        case 'pairing':
          var valentineName = req.body.Body;
          message = `So ${user.firstName}, is ${valentineName} the name of your valentime?`;
          user.valentineName = valentineName;
          user.save();
          if (body = 'y' || body == 'yes') {

            user.state = 'romancing';
            user.save();
            message = 'Okay great! Shall we proceed? Send any SMS message and I will check how romantic thou thoughts wouldst be. Otherwise type "Sonnet" and I shalt send thou a Sonnet of mine own creation. Or type "Help" to look upon mine full instructions.';
          }
          break;
        case 'naming':
          message = 'Okay great! Shall we proceed? Send any SMS message and I will check how romantic thou thoughts wouldst be. Otherwise type "Sonnet" and I shalt send thou a Sonnet of mine own creation. Or type "Help" to look upon mine full instructions.';
          break;
        default:
          var appropriateResponse = checkBody(body, user, req);
          message = appropriateResponse.message;
          media = appropriateResponse.media;

      }
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send('Could not find a user with this phone number.');
    });

  
 

  // If user is new, then register them via text

  // Otherwise check the sentiment of the incoming message and respond with + or new Sonnet.
})