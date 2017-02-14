'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

module.exports = router;
