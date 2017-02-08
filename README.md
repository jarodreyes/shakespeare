<a href="https://www.twilio.com">
  <img src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg" alt="Twilio" width="250" />
</a>

# Help Me Shakespeare!

An SMS bot that:
* Registers a user via sms
* Analyzes sentiment (positive or negative)
 on incoming SMS
* Generates unique poems from shakespeare sonnets
* Generates images of those sonnets

This was built using:
* Express.js
* Mongoose
* Node.js & npm
* twilio-node: a node helper library for the Twilio REST API
* The IBM Watson add-on for Twilio Messages
* PoetryDB
* node-gd (an image manipulation library)

## Local Development

This project is build using [Express](http://expressjs.com/) web framework and depends on [MongoDB](https://www.mongodb.com).

1. First clone this repository and `cd` into it.

   ```bash
   $ git clone git@github.com:jarodreyes/shakespeare.git
   $ cd shakespeare
   ```

1. Install the requirements.

   ```bash
   $ npm install
   ```

1. Start the server.

   ```bash
   $ npm start
   ```

1. Check it out at [http://localhost:3000](http://localhost:3000).

### Expose the Application to the Wider Internet

1. Expose your application to the wider internet using [ngrok](http://ngrok.com). You can click
  [here](#expose-the-application-to-the-wider-internet) for more details. This step
  is important because the application won't work as expected if you run it through
  localhost.

  ```bash
  $ ngrok http 3000
  ```

  Once ngrok is running, open up your browser and go to your ngrok URL. It will
  look something like this: `http://9a159ccf.ngrok.io`

1. Configure Twilio to call your webhooks.

  You will also need to configure Twilio to call your application when calls are received
  on your _Twilio Number_. The **SMS & MMS Request URL** should look something like this:

  ```
  http://<sub-domain>.ngrok.io/shakespeare/incoming
  ```

  ![Configure SMS](http://howtodocs.s3.amazonaws.com/twilio-number-config-all-med.gif)

### How To Demo

1. Text your twilio number "Hello".
1. Should get the following response:

   ```
   Hello, I am Shakespeare. It would be heavenly to assist ye. First question, what be thy first name?:
   ```
1. Reply with your name...
1. After registration is complete text a poem of your own to shakespeare or type 'SONNET' to receive a custom sonnet:


## Meta

* No warranty expressed or implied. Software is as is. Diggity.
* [MIT License](http://www.opensource.org/licenses/mit-license.html)
* Lovingly crafted by Twilio's Team 37: A labratory for inspiring ideas.
