'use strict';

var mongoose = require('mongoose');
var config = require('../config');
var twilioClient = require('twilio')(config.accountSid, config.authToken);
var Emailer = require('../lib/sendgrid-emailer');

var Sonnet = new mongoose.Schema({
  url: String,
  text: String
});

var states = ['new', 'registering', 'naming', 'pairing', 'romancing'];

var User = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  imageUrl: String,
	state: { type: String, enum: states, default: 'new' },
	valentineName: String,
  sonnets: [Sonnet]
});

// Send a text message via twilio to this user
User.methods.sendImage = function(media) {
  var self = this;
  twilioClient.sendMessage({
    to: self.phone,
    from: config.twilioNumber,
    mediaUrl: media
  }, function(err, response) {
    console.log(err);
  });
};

// Send a text message via twilio to this user
User.methods.sendEmail = function() {
    Emailer.sendEmail(this);
};
module.exports = mongoose.model('User', User);
