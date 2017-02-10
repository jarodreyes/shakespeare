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
  console.log(`Length of MEDIA= ${media.length}`);
  if (media.length > 0) {
    output.message(function() {
      this.body(message);
      this.media(media);
    });
  } else {
    output.message(function() {
      this.body(message);
    });
  }
  return output;
}

function checkBody(body, user, req) {
  var media = '',
    message = '';
  switch (body) {
    case 'shakespeare':
      media = '/images/rules.gif';
      break;
    case 'name':
      user.state = 'registering';
      user.save();
      message = `Okay what is thoust first name?`
      break;
    case 'sonnet':
      sonnetGenerator.randomSonnet(user);
      message = `To thine love, ${user.firstName}. Soon you shalt be receiving a sonnet of mine own creation. Share online using #HelpMeShakespeare.`
      break;
    case 'valentine':
      user.state = 'pairing';
      user.save();
      message = `Okay what is thoust valentine's name?`
      break;
    case 'email':
      user.state = 'naming';
      user.save();
      message = `Okay what is thoust email address?`
      break;
    default:
      var response = romanceMeter.check(user, req);
      message = response.message;
      media = response.media;
  }
  return {media: media, message: message}
}

router.post('/incoming/', function (req,res,next) {
  var body = req.body.Body.toLowerCase(),
    userPhone = req.body.From,
    message = 'Roses are red, Violets are blue, Twilio likes sending nice poems to you.',
    media = '';
  res.type('text/xml');

  var query = {phone: userPhone},
    update = { expire: new Date() },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  User.findOneAndUpdate(query, update, options)
    .then(function (user) {
      // Check if user is new, or is requesting a sonnet.
      switch (user.state) {
        case 'new':

          message = 'Hello, I am Shakespeare. It would be heavenly to assist ye. First question, what be thy first name?';
          media = '/images/welcome.gif';
          user.state = 'registering';
          user.save();
          break;
        case 'registering':
          user.firstName = req.body.Body;
          user.state = 'naming';
          user.save();
          message = `Admirable to meet ye ${user.firstName}. Next question, what is thy email address? I shalt only use this to send ye sonnets on your request.`;
          break;
        case 'pairing':
          var valentineName = req.body.Body;
          message = `So ${user.firstName}, is ${valentineName} the name of your valentime?`;
          user.valentineName = valentineName;
          user.save();
          if (body = 'y' || body == 'yes') {

            user.state = 'romancing';
            user.save();
            message = 'Okay great! Shall we proceed? Send any SMS message and I will check how romantic thou thoughts wouldst be. Otherwise type "Sonnet" and I shalt send thou a Sonnet of mine own creation. Or type "Shakespeare" to look upon mine full instructions.';
          }
          break;
        case 'naming':
          user.email = req.body.Body;
          user.state = 'romancing';
          user.save();
          user.sendEmail();
          message = 'Okay great! Shall we proceed? Send any SMS message and I will check how romantic thou thoughts wouldst be. Otherwise type "Sonnet" and I shalt send thou a Sonnet of mine own creation. Or type "Shakespeare" to look upon mine full instructions.';
          break;
        default:
          var appropriateResponse = checkBody(body, user, req);
          message = appropriateResponse.message;
          media = appropriateResponse.media;

      }
      var twiml = twimlMessage(message, media);
      res.send(twiml.toString());
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send('Could not find a user with this phone number.');
    });

    
 

  // If user is new, then register them via text

  // Otherwise check the sentiment of the incoming message and respond with + or new Sonnet.
})
module.exports = router;