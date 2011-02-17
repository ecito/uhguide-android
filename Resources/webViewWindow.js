var currentWebViewWindow = Titanium.UI.currentWindow;

var actInd = Titanium.UI.createActivityIndicator({
    height: 50,
    width: 50
});

var webview = Ti.UI.createWebView({
	url: currentWebViewWindow.webViewURL,
	scalesPageToFit: true
});

currentWebViewWindow.add(webview);

actInd.show();

webview.addEventListener('load', function(e) {
	actInd.hide();	
});

webview.addEventListener('error', function(e) {
	actInd.hide();	
	alert("Error loading website");
});