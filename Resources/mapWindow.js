var mapWindow = Titanium.UI.currentWindow;

var actInd = Titanium.UI.createActivityIndicator({
    height: 50,
    width: 50
});

var universityRegion = {latitude:29.72072515,longitude:-95.34287452,animate:true,latitudeDelta:0.005, longitudeDelta:0.005};

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
	
};

mapView.addEventListener('click', function(e) {
	var annotation = e.annotation;
	if (annotation) {
		var clicksource = e.clicksource;
		Ti.API.info('annotation click clicksource = ' + clicksource);
		if (annotation.additionalInfo.length) {
			var webviewWindow = Ti.UI.createWindow({
				fullscreen: false,
				url:'webViewWindow.js',
				webViewURL: annotation.additionalInfo,
				title: annotation.title
			});
			webviewWindow.open();
		}
	}
});