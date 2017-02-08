'use strict';

var Client = require('node-rest-client').Client;
var gd = require('node-gd');
var _ = require('underscore');

function getRandomString() {
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var random = _.sample(possible, 5).join('');
  return random;
}
 
function getRandomInt(max) {
  max = Math.floor(max);
  return Math.floor(Math.random() * (max));
}

var randomSonnet = function(user) {
  var client = new Client();
  var poem = [],
    sonnet = '';
  // direct way 
  client.get("http://poetrydb.org/author,linecount/Shakespeare;14/lines", function (data, response) {
    // parsed response body as js object 
    for (var i = 0; i < 14; i++) {
      console.log(data.length);
      var line = data[getRandomInt(data.length)].lines[i];
      console.log(`LINE ${i} ================ ${line}`);
      poem.push(line);
    }
    console.log(poem);
    sonnet = createImage(poem, user);
    return sonnet;
  });
}

var createImage = function(poemArray, user) {
  var baseY = 336,
    leading = 50;
  gd.openFile('./public/shakespeare.gif', function(err, img) {
    if (err) {
      throw err;
    }
    console.log(err, img);
    var txtColor = img.colorAllocate(13, 18, 43);
    var txtColor2 = img.colorAllocate(241, 47, 70);
    // Set full path to font file 
    var fontPath = './public/fonts/whitney-book.otf';
    var pid = getRandomString();
    var path = `./public/shakes/shake${pid}.gif`;
    console.log(pid);
     
    for (var i = 0; i < poemArray.length; i++) {
      var newY = baseY + (leading * i);
      console.log(`NEW Y ===================== ${newY}`);
      // Render string in image 
      img.stringFT(txtColor, fontPath, 21, 0, 77, newY, poemArray[i]);
    }
    
    img.stringFT(txtColor2, fontPath, 28, 0, 120, 1096, `To ${user.valentineName},\r\n    - Love ${user.firstName}`);
    img.saveFile(path, function(err) {
      img.destroy();
      return path;
      if (err) {
        throw err;
      }
    });

  });
}

module.exports.randomSonnet = randomSonnet;