var cfg = require("dotenv").config();
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var util = require('util');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var myInputs = process.argv;

var util = require('util');
// var log_file = fs.appendFile(__dirname + '/debug.log', log_stdout);
var log_stdout = process.stdout;

console.log = function(d) { //
  // log_file.write(util.format(d) + '\n');
  fs.appendFile('./output.log', util.format(d), function(err) {
    if (err) {
      console.log(err+'\n');
    }
  });
  log_stdout.write(util.format(d) + '\n');
};


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
        var params = {screen_name: 'unrealmrNobody'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
          if (!error) {
            console.log("My tweets are as follows\n");
            for (x in tweets) {
              console.log("\t ->"+tweets[x].text+"\n");
            }
          } else {
            console.log("error is "+error)
          }
        });

        break;
    case 'spotify-this-song':
      for (var j = 0; j < inSubject.length; j++) {
        if (inSubject[j] == " ") {
          inSubject[j] = "+";
        }
      }

      // spotify
      //   .search({ type: 'track', query: inSubject, limit: 1})
      //   .then(function(response) {
      //     // console.log(response.tracks.href);
      //     console.log(response.tracks.items[0].artists[0].name)
      //     console.log(response.tracks.items[0].name)
      //     console.log(response.tracks.items[0].album.name)
      //     console.log(response.tracks.items[0].external_urls)
      //     // .tracks.items[0].album.name
      //   })
      //   .catch(function(err) {
      //     console.log(err);
      //     console.log("no song found")
      //   });
      spotify.search({ type: 'track', query: inSubject }, function(err, data) {
        if (err) {
          return console.log("We couldn't find a song of that name");
          defaultSong();
        } else {
          console.log("       Artist: "+data.tracks.items[0].artists[0].name+'\n')
          console.log("   Song Title: "+data.tracks.items[0].name+'\n')
          console.log("     On album: "+data.tracks.items[0].album.name+'\n')
          console.log("URL to sample: "+data.tracks.items[0].external_urls["spotify"]+'\n')
        }
      });
      break;
    case 'movie-this':
      for (var j = 0; j < inSubject.length; j++) {
        if (inSubject[j] == " ") {
          inSubject[j] = "+";
        }
      }
      var site = "http://www.omdbapi.com/?apikey=trilogy&t="+'"'+inSubject+'"';
      request(site, function (error, response, body) {
        if (error != null) {console.log('error:', error)
        } else {
          movieInfo = JSON.parse(body);
          console.log('       Title: '+movieInfo.Title+'\n');
          console.log('    Released: '+movieInfo.Year+'\n'); 
          console.log(' imdb Rating: '+movieInfo.imdbRating+'\n'); 
          if (movieInfo.Ratings[1] != undefined) {
            console.log(' Rotten Tom.: '+movieInfo.Ratings[1].Value+'\n'); 
          } else {
            console.log(' Rotten Tom.: No Rotten Tomatoes score available.\n')
          }
          console.log('        Plot: '+movieInfo.Plot+'\n'); // Print the responseText;
          console.log('      Actors: '+movieInfo.Actors+'\n'); // Print the responseText;
        }
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
module.exports.handleRequest;

