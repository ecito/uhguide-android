var socialLinksWindow = Titanium.UI.currentWindow;
socialLinksWindow.backgroundColor = '#000';

function createRow(link, header) {
	
	var row = Ti.UI.createTableViewRow({height:72});
	
	var label = Ti.UI.createLabel({
		text: link.title,
		color: '#fff',
		textAlign:'left',
		left:60,
		font:{fontWeight:'bold',fontSize:18},
		width:'auto',
		height:'auto'
	});
	row.add(label);
	
	var i = Ti.UI.createImageView({
		image: link.icon,
		top: 10,
		bottom: 10,
		left: 0,
		width:52,
		height:52
	});

	row.add(i);
	
	row.social_link = link.url;
	if (header != null) {
		row.header = header;
	}
	return row;
};

var actInd = Titanium.UI.createActivityIndicator({
    height: 50,
    width: 50
});

var socialLinksTableView = Titanium.UI.createTableView({
	top:0
});
socialLinksWindow.add(socialLinksTableView);


socialLinksTableView.addEventListener('click', function(e) {
	var win = Titanium.UI.createWindow({
	  title: e.title,
	  backgroundColor:'#fff',
	  fullscreen: false
	});
	var webview = Ti.UI.createWebView({top: 0});
	win.add(webview);
	Ti.API.info("URL: " + e.rowData.social_link);
	win.open ({animated: true});
	webview.url = e.rowData.social_link;
	
});

var socialLinksXHR = Titanium.Network.createHTTPClient();

socialLinksXHR.onload = function() {
	Ti.API.info("Results returned");
	var links = JSON.parse(this.responseText);
	
	var fetchedData = [];
	var currentHeader = '';
	
	for(var x = 0; x < links.length; x++) {
		var link = links[x].social_link;
			
		if (link.network != currentHeader ) {
			currentHeader = link.network;
			fetchedData.push(createRow(link, link.network));	
		} else {
			fetchedData.push(createRow(link, null));
		}
	}
	
	socialLinksTableView.setData(fetchedData);
	actInd.hide();
};

socialLinksXHR.onerror = function(e) {
	actInd.hide();
	Ti.API.info("ERROR " + e.error);
};

var linksURL = 'http://uhcamp.us.to/social_categories/' + socialLinksWindow.item_id + '/social_links';
Ti.API.info("URL: " + linksURL);
socialLinksXHR.open('GET', linksURL);
socialLinksXHR.send();
