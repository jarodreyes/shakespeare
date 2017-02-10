'use strict';

var config = {};

var dbConnection = function() {
  if (process.env.NODE_ENV === 'test') {
    return 'mongodb://localhost/test';
  }

  return 'mongodb://localhost/employee-directory';
};

config.dbConnection = process.env.MONGOLAB_URI || process.env.MONGO_SHAKESPEARE_URL || process.env.MONGO_PORT_27017_TCP_ADDR;

config.authToken = process.env.TWILIO_AUTH_TOKEN;
config.accountSid = process.env.TWILIO_ACCOUNT_SID;
config.twilioNumber = process.env.TWILIO_SHAKESPEARE_NUMBER || '+15017124613';
// config.dbConnection = dbConnection();

module.exports = config;
