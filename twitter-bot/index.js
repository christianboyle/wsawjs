const Twitter = require('twitter');
const Sheet = require('./sheet');

(async function () {
  // connect to twitter via api

  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  // pull next tweet out of spreadsheet

  const sheet = new Sheet();
  await sheet.load();
  const quotes = await sheet.getRows();
  const quote = quotes[0].quote;
  const ref = quotes[0].reference;
  const author = quotes[0].author;
  const status = quote + '\n\n' + '—' + author + ', ' + ref;

  // send the tweet

  client.post('statuses/update', { status }, function (error, tweet, response) {
    if (error) throw error;
    console.log(tweet); // Tweet body.
    //console.log(response);  // Raw response object.
  });

  // remove quote from spreadsheet

  await quotes[0].delete();

  console.log('tweeted', quotes[0].quote);
})();
