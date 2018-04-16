var cfg = require("dotenv").config();
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
// console.log(spotify)
var Twitter = require("twitter");
var util = require('util');
var keys = require("./keys.js");
// console.log(keys);
var spotify = new Spotify(keys.spotify);
// console.log(spotify);
var client = new Twitter(keys.twitter);

var myInputs = process.argv;

/*
  * `my-tweets`
  * `spotify-this-song`
  * `movie-this`
  * `do-what-it-says`
*/

var verb = myInputs[2];
var subject = '';

for (var i=3; i < myInputs.length; i++) {
  subject += myInputs[i]+" ";
}
subject.trim(); 

function handleRequest(inVerb, inSubject) {
  switch(inVerb) {
    case 'my-tweets':
        var zen = client.get('http://api.twitter.com/1.1/statuses/user_timeline.json?count=2',{include_entities:false},);
        console.log(zen);
        break;
    case 'spotify-this-song':
      spotify.search({ type: 'track', query: inSubject }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        } 
        console.log(data); 
      });
      break;
    case 'movie-this':
      console.log("movie this")
      for (var j = 0; j < inSubject.length; j++) {
        if (inSubject[j] == " ") {
          inSubject[j] = "+";
        } 
      }
      var site = "http://www.omdbapi.com/?apikey=trilogy&t="+'"'+inSubject+'"';
      console.log("site is "+site);
      request(site, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the responseText;
      });
    break;
    case 'do-what-it-says':
      fs.readFile('./random.txt', 'utf8', function(err, data) {
          console.log("the data is "+data);
          var fileText = data.split(',');
          handleRequest(fileText[0], fileText[1]);
        });
      break;
    default:
      console.log("that is not a command I recognize");
  }
}    

handleRequest(verb, subject);
