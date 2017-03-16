/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
  request = require('request'),

_ = require('lodash');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


app.get('/process_get', function (req, res) {
   // Prepare output in JSON format
   response = {
      latitude:req.query.latitude,
      longitude:req.query.longitude
      //add a text box for setting the timer
     };
	callAPI();
	setTimeout(timer, 7200000);
      
  
})

//Function to call API callURLs
function callAPI()
{
	 var callURL = "https://bb137022-5302-4ad0-bcca-d135aad195d4:MXSR7lKExz@twcservice.mybluemix.net/api/weather/v1/geocode/"+response.latitude+"/"+response.longitude+"/forecast/hourly/48hour.json?units=m&language=en-US";

      request.get(callURL, {
        json: true
      },
      function (error, response, body) {
       console.log(body)
      });
}
 
function callBingAPI()
{
	var BingCallURL = "https://dev.virtualearth.net/REST/v1/Traffic/Incidents/40.712019,-74.011202,40.802325,-73.962484/type=1,2,11/key=mGujABWbtbnV1rXYgUqK~j4P61NUO_FBaAoMwqDrYKw~AoKW6cX1AZL5aDWEPM1qDLlypJtwYItN2qA6daPd8xprscar6ng0LBzBzMlt9tz4
"

      request.get(BingCallURL, {
        json: true
      },
      function (error, response, body) {
       console.log(body)
      });
}

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});