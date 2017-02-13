'use strict';

var Client = require('node-rest-client').Client;
var gd = require('node-gd');
var poems = require('../poems.json');
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

var sonnetGenerator = {};

sonnetGenerator.randomSonnet = function(user) {
  var poem = [],
    sonnet = '';

  for (var i = 0; i < 14; i++) {
    var line = poems[getRandomInt(poems.length)].lines[i];
    poem.push(line);
  }
  console.log(poem);
  // Generate an image of the sonnet to make it easily shareable.
  sonnet = createImage(poem, user);
  return;
}

var createImage = function(poemArray, user) {
  var baseY = 336,
    leading = 50,
    pid = getRandomString(),
    path = `./public/shakes/shake${pid}.gif`,
    publicUrl = `http://45.55.136.193/shakes/shake${pid}.gif`,
    poemString = poemArray.join("\r\n");

  // Use a template gif as the starting point
  gd.openFile('./public/shakespeare.gif', function(err, img) {
    if (err) {
      throw err;
    }
    
    // set text colors
    var txtColor = img.colorAllocate(13, 18, 43);
    var txtColor2 = img.colorAllocate(241, 47, 70);

    // Setup fonts and signature
    var fontPath = './public/fonts/whitney-book.otf';
    var signature = `  - Love ${user.firstName}`;
     
    // Since we can't set a leading value for the type, let's insert 
    // the poem lines, line by line at the specific distance
    for (var i = 0; i < poemArray.length; i++) {

      // calculate the y position using our leading value
      var newY = baseY + (leading * i);

      // insert line onto image canvas
      // (color, fontPath, fontSize, fontAngle, x, y, string)
      img.stringFT(txtColor, fontPath, 21, 0, 77, newY, poemArray[i]);
    }

    // insert signature after the poem
    img.stringFT(txtColor2, fontPath, 28, 0, 120, 1096, signature);

    img.saveFile(path, function(err) {
      // once the image actually exists on our server, 
      // then we can send it
      user.sendImage(publicUrl);

      // save it to the users profile
      user.sonnets.push({
        url: publicUrl,
        text: poemString
      })
      user.save();

      // destroy it in memory
      img.destroy();
      if (err) {
        throw err;
      }
    });

  });
  return;
}

module.exports = sonnetGenerator;