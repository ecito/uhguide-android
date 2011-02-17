var weatherWindow = Titanium.UI.currentWindow;
weatherWindow.backgroundColor = '#000';

var actInd = Titanium.UI.createActivityIndicator({
    height: 50,
    width: 50
});

function updateWeatherView(weather) {
	
	var todayIcon = Ti.UI.createImageView({
		left: 27,
		top: 20,
		width:70,
		height:63,
		image:weather.todayIconURL
	});
	
	var currentTemp = Ti.UI.createLabel({
		text:weather.currentTemp + '°F',
		textAlign:'right',
		font:{
			fontFamily:'Helvetica Neue',
			fontSize:55,
			fontWeight:'bold'
		},
		left:176,
		top:30,
		height:75
	});
	
	var todayDay = Ti.UI.createLabel({
		text:weather.todayDay,
		left:26,
		top:84,
		font:{
			fontSize:18,
			fontFamily:'Helvetica Neue',
			fontWeight:'bold'
		}
	});
	
	var todayLowTemp = Ti.UI.createLabel({
		text:'Low: ' + weather.todayLowTemp + '°F',
		left:26,
		top:110,
		font:{
			fontFamily:'Helvetica Neue',
			fontWeight:'bold',
			fontSize:10
		}
	});
	
	var todayHighTemp = Ti.UI.createLabel({
		text:'High: ' + weather.todayHighTemp + '°F',
		left:90,
		top:110,
		font:{
			fontFamily:'Helvetica Neue',
			fontWeight:'bold',
			fontSize:10
		}
	});

	var tomorrowIcon = Ti.UI.createImageView({
		left: 149,
		top: 158,
		width:27,
		height:26,
		image:weather.tomorrowIconURL
	});
	
	var tomorrowDay = Ti.UI.createLabel({
		text:weather.tomorrowDay,
		left:26,
		top:158,
		font:{
			fontSize:16,
			fontFamily:'Helvetica Neue',
			fontWeight:'bold'
		}
	});
	var tomorrowLowTemp = Ti.UI.createLabel({
		text:weather.tomorrowLowTemp + '°F',
		left:219,
		top:164,
		font:{
			fontFamily:'Helvetica Neue'
		}
	});
	var tomorrowHighTemp = Ti.UI.createLabel({
		text:weather.tomorrowHighTemp + '°F',
		left:260,
		top:164,
		font:{
			fontFamily:'Helvetica Neue'
		}
	});
	
	var lastUpdated = Ti.UI.createLabel({
		text:weather.lastUpdated,
		top:134,
		font:{
			fontSize:10,
			fontFamily:'Helvetica Neue'
		}
	});
	var weatherProvider = Ti.UI.createLabel({
		text:'Provided by: Weather Underground',
		top:0,
		font:{
			fontSize:8,
			fontFamily:'Helvetica Neue'
		},
		textAlign:'center'
	});
	
	
	weatherWindow.add(todayIcon);
	weatherWindow.add(tomorrowIcon);
	weatherWindow.add(currentTemp);
	weatherWindow.add(todayDay);
	weatherWindow.add(todayLowTemp);
	weatherWindow.add(todayHighTemp);
	weatherWindow.add(tomorrowDay);
	weatherWindow.add(tomorrowLowTemp);
	weatherWindow.add(tomorrowHighTemp);
	weatherWindow.add(lastUpdated);
	weatherWindow.add(weatherProvider);
	
};

var weatherXHR = Ti.Network.createHTTPClient();
actInd.show();
weatherXHR.onload = function()
{
	actInd.hide();
	try {
		var days = JSON.parse(this.responseText);
		var today = days[0];
		var tomorrow = days[1];
		
		var weather = {
			currentTemp: parseFloat(today.current.fahrenheit).toFixed(0),
			todayDay: today.date.weekday,
			todayHighTemp: parseFloat(today.high.fahrenheit).toFixed(0),
			todayLowTemp: parseFloat(today.low.fahrenheit).toFixed(0),
			lastUpdated: today.observation_time,
			todayIconURL: "http://icons-pe.wxug.com/i/c/a/" + today.icon + ".gif",

			tomorrowDay: tomorrow.date.weekday,
			tomorrowHighTemp: parseFloat(tomorrow.high.fahrenheit).toFixed(0),
			tomorrowLowTemp: parseFloat(tomorrow.low.fahrenheit).toFixed(0),
			tomorrowIconURL: "http://icons-pe.wxug.com/i/c/a/" + tomorrow.icon + ".gif"
		
		};
		
		updateWeatherView(weather);

	} catch(exception) {
		Ti.API.info("JSON parse error " + exception);
		
	}
};
weatherXHR.onerror = function(e) {
	actInd.hide();
	var error = e.error;
	alert("There was an error retrieving the points of interest");
};

weatherXHR.open('GET','http://uhcamp.us.to/weathers/current');
weatherXHR.send();

var weatherBGView = Titanium.UI.createImageView({
	top:-35,
	left: 0,
	image:'images/WeatherBG_noFrame.png'
});

weatherWindow.add(weatherBGView);

var webcamURL = "http://images.webcams.travel/webcam/1239991620.jpg";

var webcamView = Ti.UI.createImageView({
	bottom:10,
	width:264,
	height:198,
	image: webcamURL
	
});
weatherWindow.add(webcamView);