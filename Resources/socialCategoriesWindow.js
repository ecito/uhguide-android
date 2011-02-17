socialWindow = Titanium.UI.currentWindow;
socialWindow.fullscreen = false;
socialWindow.backgroundColor = '#000';


var actInd = Titanium.UI.createActivityIndicator({
    height: 50,
    width: 50
});

var socialCategoriesTableView = Titanium.UI.createTableView({
	top:0
});
socialWindow.add(socialCategoriesTableView);

socialCategoriesTableView.addEventListener('click', function(e) {
	var win = Titanium.UI.createWindow({
	  url:'socialLinks.js',
	  title: e.title,
	  fullscreen: false,
	  backgroundColor:'#fff'
	});
	var category = e.rowData.category;
	win.item_id = category.id;
	win.open ({animated: true});
  //Titanium.UI.currentTab.open(win, {animated:true})
});

var socialCategoriesXHR = Titanium.Network.createHTTPClient();
actInd.show();

socialCategoriesXHR.onload = function() {
	Ti.API.info("Results returned");
	var social_categories = JSON.parse(this.responseText);
	
	fetchedData = [];
	for(var x = 0; x < social_categories.length; x++) {
		var social_category = social_categories[x].social_category;
			
		fetchedData.push({
			title:social_category.title, 
			hasChild:true,
			category:social_category
		});	

	}
	
	socialCategoriesTableView.setData(fetchedData);
	actInd.hide();
	
};

socialCategoriesXHR.onerror = function(e) {
	actInd.hide();
	Ti.API.info("ERROR " + e.error);
};

socialCategoriesXHR.open('GET', "http://uhcamp.us.to/social_categories");
socialCategoriesXHR.send();