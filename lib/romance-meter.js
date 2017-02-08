'use strict';

var twilio = require('twilio'),
	sonnetGenerator = require('sonnet-generator'),
	snarky = ['I hope ye selfies are more promising.', 'If ye were a animal, it would not be a romantic one.', 'Has thee lost thine wit?', 'Perhaps thou hast not had thine morning coffee.', 'Perhaps ye should not write for a bit.', 'Perhaps ye should netflix & study more, and chill less.', 'Ye might want to read some more of mine own sonnets.', 'Some say there be no wrong answers, perhaps ye are the exception.', 'I once had a cat with your sense of romance. I used it for a stew.', 'This may be outside of mine own expertise.', 'For thous own sake, I hope ye can cook better than ye write.', 'I have met apes with better penmanship!', 'I have met otters with better penmanship!', 'I have met elephants with a gentler touch!', 'I have met iron pots with more romance in them!', 'I just choked on mine ale. That. Is. So. Bad.', 'Oh dear. I might have to ask Sir Francis Bacon to help here.', 'I just choked on a bit of ham. Or it might have been your words.', 'Would you like some baguette with that cheese?', 'I have read walls with better diction.', 'I have met dead men with better diction.', 'Hmmm. I might need Sir Bacon\'s help here.'],
	messages = ['Are you looking for an agent?', 'What are ye doing a fortnight from now?', 'Wouldst thou like to join me on a moonlit walk?', 'Thou shalt have no problems with love.', 'Ye know what they dost say, a willow without the wind is just a tree.', 'I hope thine selfies are as promising!', 'Mine own job is less secure I dare say.', 'If thou ever begins writing more, I would happily pen the forward.', 'If I yare to ye, Howza!', 'Marry thine own pen then.', 'It appears ye need me not. *Huff*', 'Shakespeare Out!', 'May peace be with ye and words fault ye not.', 'Thy button is missing... made you look.', 'It seems mine work is through. Boo.'];

function getRandomInt(max) {
  max = Math.floor(max);
  return Math.floor(Math.random() * (max));
}

var check = function(user, req) {
	console.log(`######################################## REQUEST: ${req}`);
  var sentiment = req.add_ons.results.ibm_watson_sentiment.result.docSentiment,
  	positive = messages[getRandomInt(messages.length)],
  	snark = snarky[getRandomInt(snarky.length)]
  	message = '',
  	media = '';

  if (sentiment.score > 0.4) {
  	message = `Well done ${user.firstName}, you cherub! Thou hast created quite the romantic message. ${positive}`;
  } else {
  	message = `Oof ${user.firstName}. ${snark} May I recommend thou uses a sonnet of mine own... writing it now.`;
  	media = sonnetGenerator.randomSonnet();
  }
  return {
  	'message': message,
  	'media': media
  }
};

module.exports.check = check;
