var directoryWindow = Titanium.UI.currentWindow;
directoryWindow.backgroundColor = '#000';

var actInd = Titanium.UI.createActivityIndicator({
    height: 50,
    width: 50
});

var directoryTableView = Titanium.UI.createTableView({
	top:40,
	data:[{title:'Type a name to search...'}]
});
directoryWindow.add(directoryTableView);

directoryTableView.addEventListener('click', function(e) {
	if (e.rowData.person) {
		var win = Titanium.UI.createWindow({
		  url:'contactWindow.js',
		  title: e.title,
		  fullscreen: false,
		  backgroundColor:'#fff'
		});
		win.person = e.rowData.person;
		win.open ({animated: true});
	}
});

function sortByLastName(a, b) {
    var x = a.person.sn.toLowerCase();
    var y = b.person.sn.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
};

function sortByFirstName(a, b) {
    var x = a.person.givenname.toLowerCase();
    var y = b.person.givenname.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
};

function doubleSortNames(a, b) {
	return sortByLastName(a, b) || sortByFirstName(a, b);
}

var directoryXHR = Titanium.Network.createHTTPClient();
directoryXHR.onload = function() {
	Ti.API.info("Results returned");
	var people = JSON.parse(this.responseText);
	

	var sortedPeople = people.sort(doubleSortNames);
	Ti.API.info("Number of people returned: " + sortedPeople.length);
	var fetchedData = [];
	var currentHeader = '';
	
	for(var x = 0; x < sortedPeople.length; x++) {
		var person = sortedPeople[x].person;
			
		if (person.sn.charAt(0).toUpperCase() != currentHeader ) {
			currentHeader = person.sn.charAt(0).toUpperCase();
			fetchedData.push({
				title:person.givenname + ' ' + person.sn, 
				hasChild:true, 
				header:person.sn.charAt(0),
				person:person
			});	
		} else {
			fetchedData.push({
				title:person.givenname + ' ' + person.sn,
				hasChild:true,
				person:person
			});
		}
	}
	
	directoryTableView.setData(fetchedData);
	actInd.hide();
	
};

directoryXHR.onerror = function(e) {
	actInd.hide();
	Ti.API.info("ERROR " + e.error);
};

function searchText(text) {
	directoryXHR.abort();
	if(text.length > 3) {
		Ti.API.info("Searching.. " + encodeURI(text));
		var searchURL = 'http://uhcamp.us.to/people/search?name=' + encodeURI(text);
		Ti.API.info("URL: " + searchURL);
		directoryXHR.open('GET', searchURL);
		directoryXHR.send();
	}
}

var directorySearch = Titanium.UI.createSearchBar({
	barColor:'#000', 
	showCancel:true,
	height:43,
	placeholder:'John Doe', //its not placeholder
	top:0
});

directorySearch.addEventListener('return', function(e) {
	actInd.show();
	directorySearch.blur();
	searchText(directorySearch.value);
});

directorySearch.addEventListener('change', function(e) {
	Titanium.API.info('search bar: you type ' + e.value + ' act val ' + directorySearch.value);
});

directoryWindow.add(directorySearch);
