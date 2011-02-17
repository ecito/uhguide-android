var prezTweet = Ti.UI.createView ({
	left:10,
	right:10,
	bottom:50,
	height:130
});
launcher.add(prezTweet);

var prezPic = Ti.UI.createImageView ({
	image:"http://tweetimag.es/i/uhpres_n.png",
	height:48,
	width:48,
	left:0,
	top:0
});
prezTweet.add(prezPic);

var prezLabel = Ti.UI.createLabel ({
	text: "UHPres says",
	width:48,
	height:'auto',
	left:0,
	top: 52,
	color:'#000',
	font:{
		fontSize:12
	}
});
prezTweet.add(prezLabel);

var tweetContainer = Ti.UI.createView({
	left: 58,
	right:0,
	bottom:10,
	top:0,
	backgroundColor:'#990000',
	borderRadius:10
});

prezTweet.add(tweetContainer);

var tweetLabel = Ti.UI.createLabel({
	left:10,
	right:10,
	top:10,
	height:'auto',
	font:{
		fontSize:14,
		fontColor:'#fff'
	}
});
tweetContainer.add(tweetLabel);

prezTweet.visible = false;
prezTweet.addEventListener('click',function(e) {
	var webview = Ti.UI.createWebView();
	var webviewWindow = Ti.UI.createWindow({fullscreen: false});
	webview.url = "http://twitter.com/UHPres";
	webviewWindow.add(webview);
	webviewWindow.open();
});

var prezTweetXHR = Ti.Network.createHTTPClient();
prezTweetXHR.onload = function()
{
	try {
		var tweet = JSON.parse(this.responseText).results[0].text;
		tweetLabel.text = tweet;
		prezTweet.visible = true;
		
	} catch(exception) {
		Ti.API.info("JSON parse error " + exception);
		
	}
};
prezTweetXHR.onerror = function(e) {
	var error = e.error;
	alert("There was an error retrieving the points of interest");
};

url = "http://search.twitter.com/search.json?q=from%3AUHPres&rpp=1"
prezTweetXHR.open('GET',url);
prezTweetXHR.send();


