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
var Client = require('ibmiotf');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();



var config = {
    "org" : "7s51sp",
    "id" : "123321123321",
    "domain": "internetofthings.ibmcloud.com",
    "type" : "ITIC",
    "auth-method" : "token",
	"auth-token" : "clemson2017"
};
var deviceClient = new Client.IotfDevice(config);

deviceClient.connect();
deviceClient.on('connect', function () {

    console.log("Device Connected")



});
deviceClient.on("error", function (err) {
    console.log("Error : **************************************************************************************************************************************************"+err);
});





function timer()
{
	console.log("timer---------------------")
	callAPI();
	callBingAPI();
	console.log("end timer=================")
}



app.get('/process_get', function (req, res) {
   // Prepare output in JSON format
   
	callAPI();
	callBingAPI();
	
	
	
	setInterval(timer, 15000);
      
    console.log("{{{{{{{{{{{{{{{ End of app.get }}}}}}}}}}}}}}}");
})





//Function to call API callURLs
function callAPI()
{
	
	//var weather_data=new Array()
	console.log("-----------------------WEATHER API-------------------------");
	 var callURL = "https://b10828d4-199b-478b-af73-aeec0464a25b:fVtgmUGHDl@twcservice.mybluemix.net/api/weather/v1/geocode/40.7361/-73.9000/forecast/hourly/48hour.json?units=m&language=en-US";

      request.get(callURL, {
        json: true
      },
      function (error, response, body) {
      	var fore=body.forecasts
      	for (var n=0;n<fore.length;n++)
      	{
      		var temp=fore[n].temp
      		var severity=fore[n].severity
      		var precip=fore[n].precip_type
      		
      		deviceClient.publish("status","json",'{"d":{"type" : "weather", "time" : \"'+fore[n].fcst_valid_local+'\","severity" : '+severity +',"temp" : '+temp+',"precip" : '+precip+'}}',1)
      		//weather_data.push({fore[n].fcst_valid_local,severity,temp,precip}
      	}
      });
     // return weather_data;
}

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

var typeNames = ["0","Accident","Congestion","Disabled Vehicle","_","_","_","_","Road Hazard","Construction","_","_"];

function callBingAPI()
{
	  //var traffic_data=new Array()
	  console.log("--------------BING API CALL-------------------------");
      var BingCallURL = "https://dev.virtualearth.net/REST/v1/Traffic/Incidents/40.6361,-74.0618,40.9147,-73.7193?severity=1,2,3,4&type=1,2,3,4,5,6,7,8,9,10&key=UY6YnkP3hKrt58WiP94T~zG2zZWIacPxE5Gn5duy68A~AmUofFBps_4577biKIKW0bT_FPwgEcihv-_Nc8_tP21wZSLKz_fMeTLXmP0U3nNn";
      
      request.get( BingCallURL, {
        json: true
      },
         function (error, response, body) {
          var data=body
          var size=data.resourceSets[0].estimatedTotal
          var res=data.resourceSets[0].resources;
          console.log("size",size)
          for (var i=0; i < res.length; i++) {
          		console.log(JSON.stringify(res[i]))
          		var topCorner = res[i].point.coordinates//array size 2 of [lat,long] 
          		var botCorner = res[i].toPoint.coordinates
          		var center = [ (topCorner[0]+botCorner[0])/2.0 , (topCorner[1]+botCorner[1])/2.0 ]
          		var textLocation=res[i].description //ex: "between 11th street and bank street"
          		var severity=res[i].severity
          		var duration = res[i].end-res[i].start
      			var type=res[i].type
      			var datesec=parseInt(res[i].start.replace(/\D/g,''),10)
      			console.log("datesec=[",datesec,"]")
      			var date=new Date(datesec)
      			console.log("date=[",date.toISOString(),']')
          		if (typeNames[type]==="_")
          		{
          			console.log("type filtered; type=",type,"; typename=",typeNames[type]);
          		}
          		else
	          	{	
	          		console.log("published; type=",typeNames[type])
	          		deviceClient.publish("status","json",'{"d":{"type" : "traffic", "time" : \"'+date.toISOString() +'\","severity" : '+severity +',"type" : '+typeNames[type]+',duration:'+duration+'}}',1)
          		}
          }
          console.log("===========BING Completed======================");
      });
}
