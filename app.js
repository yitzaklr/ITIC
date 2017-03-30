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



function timer()
{
	callAPI();
	callBingAPI();
}



app.get('/process_get', function (req, res) {
   // Prepare output in JSON format
   response = {
      //add a text box for setting the timer
     };
	callAPI();
	callBingAPI();
	setTimeout(timer, 7200000);
      
  
})

//Function to call API callURLs
function callAPI()
{
	console.log("-----------------------WEATHER API-------------------------");
	 var callURL = "https://b10828d4-199b-478b-af73-aeec0464a25b:fVtgmUGHDl@twcservice.mybluemix.net/api/weather/v1/geocode/40.7831/-73.9712/forecast/hourly/48hour.json?units=m&language=en-US";

      request.get(callURL, {
        json: true
      },
      function (error, response, body) {
    //   console.log(body)
      });
}

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});


function callBingAPI()
{
	  console.log("--------------BING API CALL-------------------------");
      var BingCallURL = "https://dev.virtualearth.net/REST/v1/Traffic/Incidents/40.712019,-74.011202,40.802325,-73.962484?severity=1,2,3,4&type=1,2,3,4,5,6,7,8,9,10&key=UY6YnkP3hKrt58WiP94T~zG2zZWIacPxE5Gn5duy68A~AmUofFBps_4577biKIKW0bT_FPwgEcihv-_Nc8_tP21wZSLKz_fMeTLXmP0U3nNn";
//      var BingCallURL = "https://dev.virtualearth.net/REST/v1/Traffic/Incidents/40.712019,-74.011202,40.802325,-73.962484?key=UY6YnkP3hKrt58WiP94T~zG2zZWIacPxE5Gn5duy68A~AmUofFBps_4577biKIKW0bT_FPwgEcihv-_Nc8_tP21wZSLKz_fMeTLXmP0U3nNn";
      
      request.get( BingCallURL, {
        json: true
      },
         function (error, response, body) {
        //  console.log(error)
        //  console.log(response)
          var data=JSON.parse(body)
          int size=data.resourceSets.estimatedTotal
          int n=0
          for (i in data.resourceSets.resources) {
          		console.log('Incident ', n)
          		console.log(i)
          }
      });
}
