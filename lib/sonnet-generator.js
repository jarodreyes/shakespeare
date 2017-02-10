'use strict';

var Client = require('node-rest-client').Client;
var gd = require('node-gd');
var _ = require('underscore');

var sonnetGenerator = {};

function getRandomString() {
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var random = _.sample(possible, 5).join('');
  return random;
}
 
function getRandomInt(max) {
  max = Math.floor(max);
  return Math.floor(Math.random() * (max));
}

sonnetGenerator.randomSonnet = function(user) {
  var client = new Client();
  var poem = [],
    sonnet = '';
  // direct way 
  client.get("http://poetrydb.org/author,linecount/Shakespeare;14/lines", function (data, response) {
    // parsed response body as js object 
    for (var i = 0; i < 14; i++) {
      var line = data[getRandomInt(data.length)].lines[i];
      console.log(`LINE ${i} ================ ${line}`);
      poem.push(line);
    }
    sonnet = createImage(poem, user);
    return;
  });
}

var createImage = function(poemArray, user) {
  var baseY = 336,
    leading = 50,
    pid = getRandomString(),
    path = `./public/shakes/shake${pid}.gif`,
    publicUrl = `http://45.55.136.193/shakes/shake${pid}.gif`,
    poemString = poemArray.join("\r\n");
  gd.openFile('./public/shakespeare.gif', function(err, img) {
    if (err) {
      throw err;
    }
    console.log(err, img);
    var txtColor = img.colorAllocate(13, 18, 43);
    var txtColor2 = img.colorAllocate(241, 47, 70);
    // Set full path to font file 
    var fontPath = './public/fonts/whitney-book.otf';
    
    var signature = `  - Love ${user.firstName}`;
     
    for (var i = 0; i < poemArray.length; i++) {
      var newY = baseY + (leading * i);
      // Render string in image 
      img.stringFT(txtColor, fontPath, 21, 0, 77, newY, poemArray[i]);
    }
    img.stringFT(txtColor2, fontPath, 28, 0, 120, 1096, signature);
    img.saveFile(path, function(err) {
      user.sendImage(publicUrl);
      user.sonnets.push({
        url: publicUrl,
        text: poemString
      })
      user.save();
      img.destroy();
      if (err) {
        throw err;
      }
    });

  });
  return;
}

module.exports = sonnetGenerator;