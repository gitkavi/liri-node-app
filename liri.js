require("dotenv").config();

var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");

var Twitter = require("twitter");
var client = new Twitter(keys.twitter);

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var operation = process.argv[2];
var songName = process.argv[3];
var movieName = process.argv[3];

var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";



if (operation === "my-tweets") {
    my_Tweets();
}
else if (operation === "spotify-this-song") {
    spotify_this_song();
}
else if (operation === "movie-this") {
    // console.log(queryUrl);
    movie_this();
}
else if (operation === "do-what-it-says") {
    do_what_it_says();
}


function my_Tweets() {
    client.get('statuses/user_timeline', { count: 20 }, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("\nText: ", tweets[i].text);
                console.log("Created at: ", tweets[i].created_at);
            }
        }
        else {
            return console.log(error);
        }
    });
}

function spotify_this_song() {
    if (!songName) {
        spotify.search({ type: "track", query: "The Sign", limit: 5 }, function (err, data) {
            if (!err) {
                for (var i = 0; i < data.tracks.items.length; i++) {
                    console.log("\nAlbum Name: ", data.albums.items[i].name);
                    console.log("Artist(s):");
                    for (var j = 0; j < data.tracks.items[i].artists.length; j++) {
                        console.log(data.tracks.items[i].artists[j].name);
                    }
                    console.log("Preview Link: ",data.tracks.items[i].preview_url);
                    console.log("External Link: ", data.tracks.items[i].external_urls.spotify, "\n");
                }
            }
            else {
                return console.log('Error occurred: ' + err);
            }
        });
    }
    else {

        spotify.search({ type: "track", query: songName, limit: 5 }, function (err, data) {
            if (!err) {
                for (var i = 0; i < data.tracks.items.length; i++) {
                    console.log("\nAlbum name: ",data.tracks.items[i].album.name);
                    console.log("Song Name: ", data.tracks.items[i].name);
                    var artists =[];
                    for (var j = 0; j < data.tracks.items[i].artists.length; j++) {
                        artists.push(data.tracks.items[i].artists[j].name);
                    }
                    console.log("Artist(s): ",artists.join(","));
                    console.log("Preview Link: ",data.tracks.items[i].preview_url);
                    console.log("External Link: ", data.tracks.items[i].external_urls.spotify, "\n");
                }
            }
            else {
                return console.log('Error occurred: ' + err);
            }
        });
    }
}

function movie_this() {
    if (!movieName) {

        queryUrl = "http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy";

        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("\nTitle: ", JSON.parse(body).Title);
                console.log("Release Date: ", JSON.parse(body).Released);
                console.log("IMDB Rating: ", JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: ", JSON.parse(body).Ratings[1].Value);
                console.log("Country: ", JSON.parse(body).Country);
                console.log("Language: ", JSON.parse(body).Language);
                console.log("Plot: ", JSON.parse(body).Plot);
                console.log("Actors: ", JSON.parse(body).Actors, "\n");

                console.log("If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!\n");
            }
            else {
                return console.log("Error Occurred: ", error);
            }
        });
    }
    else {
        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("\nTitle: ", JSON.parse(body).Title);
                console.log("Release Date: ", JSON.parse(body).Released);
                console.log("IMDB Rating: ", JSON.parse(body).imdbRating);
                if (JSON.parse(body).Ratings[1].Source === "Rotten Tomatoes")
                {
                    console.log("Rotten Tomatoes Rating: ", JSON.parse(body).Ratings[1].Value);
                }
                else{
                    console.log("Rotten Tomatoes Rating: N/A");
                }
                console.log("Country: ", JSON.parse(body).Country);
                console.log("Language: ", JSON.parse(body).Language);
                console.log("Plot: ", JSON.parse(body).Plot);
                console.log("Actors: ", JSON.parse(body).Actors, "\n");
            }
            else {
                return console.log("Error Occurred: ", error);
            }
        });
    }
}

function do_what_it_says() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error) {
            var dataArr = data.split(",");
            operation = dataArr[0];
            songName = dataArr[1];
            if(operation === "spotify-this-song"){
                spotify_this_song();
            }
        }
        else {
            return console.log(error);
        }
    });
}