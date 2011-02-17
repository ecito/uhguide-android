function createTabItem(category) {

	var tabItemView = Titanium.UI.createImageView({
		image:"images/" + category.default_marker,
		width:32,
		height:37
	});
	
	var categoryLabel = Ti.UI.createLabel({
		text:category.name,
		font:{fontSize:10},
		color:'#fff',
		width:75,
		textAlign:'center',
		height:26,
		left: 10
	});
	// var tempView = Ti.UI.createView();
	// 
	// tempView.add(categoryLabel);
	// 
	// var tabItemView = Ti.UI.createView({
	// 	backgroundColor:'#990000',
	// 	top: 5,
	// 	borderRadius:20,borderWidth:2,borderColor:'#fff',
	// 	width:categoryLabel.width + 20,
	// 	height:30
	// });
	// 
	tabItemView.category = category;
	// 
	// tabItemView.add(categoryLabel);
	// 
	tabItemView.addEventListener('singletap',function(e) {
		if (e.source.category) {
			Ti.API.info("sup " + e.source.category.name);
			showCategory(category);
		}
	});
	// 
	// tabItemView.addEventListener('deselect',function(e) {
	// 
	// });
	
	return tabItemView;
};
	

tabViews = [];

var leftImage = Ti.UI.createView({
	backgroundImage:'images/icon_arrow_left.png',
	height:20,
	width:30,
	top:18,
	left:5,
	visible:false
});

var rightImage = Ti.UI.createView({
	backgroundImage:'images/icon_arrow_right.png',
	height:20,
	width:30,
	top:18,
	right:5
});

var scrollView = Titanium.UI.createScrollView({
	contentHeight:45,
	contentWidth:1000,
	top:0,
	height:60,
	width:mapWindow.width - 70,
	borderRadius:5,
	borderColor:'#000',
	borderWidth:2,
	backgroundColor:'#CCC'
});

var categoryXHR = Ti.Network.createHTTPClient();

actInd.show();
categoryXHR.onload = function()
{
	actInd.hide();
	
	try {
		var categories = JSON.parse(this.responseText);
	
		var lastTabPositionRight = 0;
		
		var left = 10;
		
		for (var x = 0; x < categories.length; x++) {
			var category = categories[x].category;
			var categoryTab = createTabItem(category);
			
			categoryTab.left = left;
			left += 15 + categoryTab.width;
			Ti.API.info("left: " + left + " width " +  categoryTab.width);
		
			tabViews.push(categoryTab);
		}
		
		for (var c = 0; c < tabViews.length; c++) {
			scrollView.add(tabViews[c]);
		}

		scrollView.contentWidth = left;
		
		if (scrollView.contentWidth > scrollView.width) {
	 		mapWindow.add(leftImage);
			mapWindow.add(rightImage);
		}
		mapWindow.add(scrollView);
		
	} catch(exception) {
		alert("There was an error retrieving the points of interest");
		Ti.API.info("JSON parse error " + exception);
		
	}
};
categoryXHR.onerror = function(e)
{
	actInd.hide();
	var error = e.error;
	alert("There was an error retrieving the points of interest");
};

categoryXHR.open('GET','http://uhcamp.us.to/categories.json');
categoryXHR.send();

scrollView.addEventListener('scroll', function(e)
{
	Ti.API.info('x ' + e.x + ' y ' + e.y);
	
	if (e.x > 50) {
		leftImage.show();
	} else {
		leftImage.hide();
	} if (e.x < 190) {
		rightImage.show();
	} else {
		rightImage.hide();
	}

});
