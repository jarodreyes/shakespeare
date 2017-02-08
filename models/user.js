'use strict';

var mongoose = require('mongoose');

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
	state: { type: String, enum: states },
	valentineName: String,
  sonnets: [Sonnet]
});

module.exports = mongoose.model('User', User);
