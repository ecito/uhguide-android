var mapWindow = Titanium.UI.currentWindow;


var actInd = Titanium.UI.createActivityIndicator({
    height: 50,
    width: 50
});

var universityRegion = {latitude:29.72072515,longitude:-95.34287452,animate:true,latitudeDelta:0.05, longitudeDelta:0.05};

var mapView = Titanium.Map.createView({
	mapType: Titanium.Map.STANDARD_TYPE,
	region:universityRegion,
	animate:true,
	regionFit:true,
	userLocation:true
});



mapWindow.add(mapView);


Ti.include("poiTabsView.js");
Ti.include("buildingSearchView.js");

var currentInterestsAnnotations = [];

function showCategory(category) {
	var poiXHR = Ti.Network.createHTTPClient();
	
	actInd.show();
	
	poiXHR.onload = function()
	{
		actInd.hide();
		try {
			var interests = JSON.parse(this.responseText);
						
			for (var a = 0; a < currentInterestsAnnotations.length; a++) {
				mapView.removeAnnotation(currentInterestsAnnotations[a]);
			}
			
			currentInterestsAnnotations = [];
			
			for (var i = 0; i < interests.length; i++) {
				var interest = interests[i].interest;
				
				
				var interestAnnotation = Titanium.Map.createAnnotation({
					latitude: parseFloat(interest.latitude),
					longitude: parseFloat(interest.longitude),
					title: interest.name,
					subtitle: interest.description,
					pinImage: 'images/' + interest.marker_icon,
					//pincolor:Titanium.Map.ANNOTATION_GREEN,
					annotationType:'interest',
					additionalInfo:interest.url,
					animate:true
				});
				
				currentInterestsAnnotations.push(interestAnnotation);
				mapView.addAnnotation(interestAnnotation);
			}
			
	
		} catch(exception) {
			Ti.API.info("JSON parse error " + exception);

		}
	};
	
	poiXHR.onerror = function(e)
	{
		actInd.hide();
		var error = e.error;
		alert("There was an error retrieving the points of interest");
	};

	poiXHR.open('GET','http://uhcamp.us.to/interests?category=' + category.name);
	poiXHR.send();
	
}

if (Titanium.Platform.name == 'android') {
	var menu = Titanium.UI.Android.OptionMenu.createMenu();
	
	sat = Titanium.UI.Android.OptionMenu.createMenuItem({title : 'Satellite'});
	sat.addEventListener('click',function() {
		mapView.setMapType(Titanium.Map.SATELLITE_TYPE);
	});
	
	std = Titanium.UI.Android.OptionMenu.createMenuItem({title : 'Standard'});
	std.addEventListener('click',function() {
		mapView.setMapType(Titanium.Map.STANDARD_TYPE);
	});
	
	hyb = Titanium.UI.Android.OptionMenu.createMenuItem({title : 'Hybrid'});
	hyb.addEventListener('click',function() {
		mapView.setMapType(Titanium.Map.HYBRID_TYPE);
	});
	
	zoomin = Titanium.UI.Android.OptionMenu.createMenuItem({title : "Zoom In"});
	zoomin.addEventListener('click',function() {
		mapView.zoom(1);
	});
	
	zoomout = Titanium.UI.Android.OptionMenu.createMenuItem({title : 'Zoom Out'});
	zoomout.addEventListener('click',function() {
		mapView.zoom(-1);
	});
	
	removeAll = Titanium.UI.Android.OptionMenu.createMenuItem({title : 'Remove All'});
	removeAll.addEventListener('click',function() {
		mapView.removeAllAnnotations();
	});
	
	menu.add(std);
	menu.add(hyb);
	menu.add(sat);
	menu.add(zoomin);
	menu.add(zoomout);
	menu.add(removeAll);
	Titanium.UI.Android.OptionMenu.setMenu(menu);
	
}
