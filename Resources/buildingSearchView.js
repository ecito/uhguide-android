var buildingsDB = Titanium.Database.install('buildings.sqlite3', 'buildings');

function loadBuildingsMatching(text) {
	var rows;
	if (text.length > 0) {
		rows = buildingsDB.execute("SELECT * FROM buildings WHERE name LIKE \'%" + text + "%\' OR code LIKE \'%" + text + "%\' ORDER BY name");
	} else {
		rows = buildingsDB.execute('SELECT * FROM buildings ORDER BY name');
	}

	var buildingsArray = [];
	while (rows.isValidRow())
	{
		buildingsArray.push({
			hasChild:true,
			title: rows.fieldByName('name'),
			subtitle: rows.fieldByName('number') + ' - (' + rows.fieldByName('code') + ')',
			code: rows.fieldByName('code'),
			latitude: parseFloat(rows.fieldByName('latitude')),
			longitude: parseFloat(rows.fieldByName('longitude'))
		
		});
		Titanium.API.info('ID: ' + rows.field(0) + ' NAME: ' + rows.fieldByName('name') + ' COLUMN NAME ' + rows.fieldName(0));
		rows.next();
	}
	rows.close();

	if (buildingsArray.length == 0) {
		buildingsArray.push({
			title:"No matches"
		});
	}
	return buildingsArray;
};

var buildingSearchBar = Titanium.UI.createSearchBar({
	barColor:'#000', 
	showCancel:true,
	height:43,
	top:60
});

var buildingsTableView = Titanium.UI.createTableView({
	backgroundColor: '#000',
	top:98,
	visible: false
});

buildingSearchBar.addEventListener('return', function(e) {
	buildingSearchBar.blur();
});

buildingSearchBar.addEventListener('cancel', function(e) {
  	buildingSearchBar.blur();
	buildingsTableView.visible = false;

});

buildingSearchBar.addEventListener('change', function(e) {
	if (buildingSearchBar.value.length) {
		var typedChars = buildingSearchBar.value.length;
		
		setTimeout(function()
		{
			if (typedChars == buildingSearchBar.value.length) {
		 		buildingsTableView.setData(loadBuildingsMatching(buildingSearchBar.value));
			}
		},500);

		
		buildingsTableView.visible = true;
		
	} else {
		buildingsTableView.setData([]);
		buildingsTableView.visible = false;
	}
});


buildingsTableView.addEventListener('click', function(e) {
	if (e.rowData) {
		
		var buildingAnnotation = Titanium.Map.createAnnotation({
			latitude: e.rowData.latitude,
			longitude: e.rowData.longitude,
			title: e.rowData.title,
			subtitle: e.rowData.subtitle,
			pinImage: 'images/building.png',
			annotationType:'building',
			animate:true
		});
		
		mapView.setLocation({
			latitudeDelta: 0.005,
			longitudeDelta: 0.005,
			latitude: e.rowData.latitude,
			longitude: e.rowData.longitude
		});
		
		if (e.rowData.code.length) {
			buildingAnnotation.additionalInfo = 'http://www.uh.edu/campus_map/buildings/' + e.rowData.code;
		}	
		
		mapView.addAnnotation(buildingAnnotation);
		buildingsTableView.visible = false;
		Ti.UI.Android.hideSoftKeyboard();
	}
});


mapWindow.add(buildingSearchBar);
mapWindow.add(buildingsTableView);

