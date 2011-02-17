Titanium.UI.setBackgroundColor('#fff');


var launcher = Titanium.UI.createWindow({  
    title:'UH Guide',
    backgroundColor:'#fff',
	exitOnClose: true
});

var bottomLogo = Titanium.UI.createImageView({
	image:'images/bottomLogo.png',
	width:306,
	height:53, 
	bottom:1
});

launcher.add(bottomLogo);
Ti.include("uhPresTweet.js");

windows = [{
		title:'Map',
		source:'mapWindow.js',
		icon:'images/map2.png'
	},
	{
		title:'Weather',
		source:'weatherWindow.js',
		icon:'images/weather2.png'
	},
	{
		title:'Directory',
		source:'directoryWindow.js',
		icon:'images/person.png'
	},
	// {
	// 	title:'Twitter',
	// 	source:'twitterWindow.js',
	// 	icon:'images/twitter2.png'
	// },
	{
		title:'Social Media',
		source:'socialCategoriesWindow.js',
		icon:'images/twitter2.png'
	},
	{
		title:'Shuttle Predictions',
		source:'nextbusWindow.js',
		icon:'images/nextbus.png'
	}
];

var padding = 50;
var x = 20;
var y = 20;

for (var w = 0; w < windows.length; w++) {
	var windowInfo = windows[w];
	
	var launcherItem = Ti.UI.createButton({
		backgroundImage:windowInfo.icon,
		left:x,
		top:y,
		width:57,
		height:57,
		windowInfo:windowInfo
	});
	
	var launcherItemLabel = Ti.UI.createLabel({
		text:windowInfo.title,
		top:y + 62,
		left:x - 10,
		textAlign:'center',
		touchEnabled: false,
		width:77,
		height:36,
		color:'#000',
		font:{
			fontSize:12,
			fontWeight:'bold'
		}
	});
	
	x += launcherItem.width + padding;
	
	if (x >= 300) {
		y += launcherItem.height + padding;
		x = 20;
	}
	
	launcherItem.addEventListener('click',function(e) {
		Ti.API.info("Clicked an item! " + e.source.text + " - " + e.source.windowInfo.title);
		var newWindow = Titanium.UI.createWindow({  
			modal:true,
			url:e.source.windowInfo.source,
		    title:e.source.windowInfo.title,
		    backgroundColor:'#ccc',
			fullscreen: false
		});
		newWindow.open();
	});
	

	launcher.add(launcherItem);
	launcher.add(launcherItemLabel);
	
}

launcher.open();
