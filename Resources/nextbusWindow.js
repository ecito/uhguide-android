nextbusWindow = Titanium.UI.currentWindow;
nextbusWindow.fullscreen = false;
nextbusWindow.backgroundColor = '#000';

var webview = Ti.UI.createWebView({top: 0});
nextbusWindow.add(webview);
webview.url = "http://www.nextbus.com/wireless/miniRoute.shtml?a=uhouston"