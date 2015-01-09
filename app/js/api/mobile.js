/**
	* Mobile 
	* @class Mobile
	* @requires cordova.js and device cordova plugin
*/
var Mobile = {};
(function() {

	this.OS;
	this.OSVersion;
	this.DeviceModel;
	var menuSelector = "#sidebar-wrapper";

	this.load = function() {

		document.addEventListener("offline", onMobileOffline, false);
		document.addEventListener("online", onMobileOnline, false);
		document.addEventListener("deviceready", onMobileReady, false);
	};

	var eventActions = {

		onBackButton: function() {
			history.back();
		},

		onMenuButton: function(e) {
			//$(menuSelector).css("top", $(window).scrollTop()).toggleClass("active");
			MainMenu.toggleMenu()
		},

		onPause: function(e) {
			alert("you can customize personal actions for end os pause event in /api/mobile.js function onPause");
		},

		onResume: function(e) {
			alert("you can customize personal actions for resume event in /api/mobile.js function onResume");
		}

	};

	var onMobileOnline = function () {
		// Show online features
	}

    var onMobileOffline = function () {
    	// Hide online features
    }

	var onMobileReady = function () {
		setOS();
		setOSVersion();
		setDeviceModel();
		addStylesToBody();
		addSystemLinksEvent()
		//loadAllPlatformsFunctions();

		switch (Mobile.OS){
			case "Android":
				loadAndroidOnlyFunctions();
			break;
			case "BlackBerry 10":
				loadBlackberryOnlyFunctions();
			break;
			case "iOS":
				loadiOSOnlyFunctions();
			break;
			case "WinCE":
				loadWindowsPhoneOnlyFunctions();
			break;
			case "Tizen":
				loadTizenOnlyFunctions();
			break;
		}
    }		

	var setOS = function () {		
		Mobile.OS = device.platform;
	};

	var setOSVersion = function () {
		Mobile.OSVersion = device.version;
	};

	var setDeviceModel = function () {
		Mobile.DeviceModel = device.model;
	};

	var addSystemLinksEvent = function (){
		$("body")
		    .on("click", "a[target=_blank]", function (e) {
		    	e.preventDefault();
		    	window.open( $(this).attr("href"), '_blank', 'location=yes');
		    })
		    .on("click", "a[rel=_system]", function (e) {
		    	e.preventDefault();
		    	//navigator.app.loadUrl($(this).attr("href"));
		    	window.open( $(this).attr("href"), '_system', 'location=yes');
		    });
	}

	var addStylesToBody = function (){
		document.body.className = Mobile.OS.toLowerCase() + "-" 
								+ Mobile.OSVersion.replace(/\./g, "") + " " 
								+ document.body.className;
	};

	var loadAllPlatformsFunctions = function (){
		document.addEventListener("pause", eventActions.onPause, false);
		document.addEventListener("resume", eventActions.onResume, false);
	};

	var loadAndroidOnlyFunctions = function (){
		document.addEventListener("backbutton", eventActions.onBackButton, false);
		document.addEventListener("menubutton", eventActions.onMenuButton, false);
	};

	var loadBlackberryOnlyFunctions = function (){
		//ADD HERE YOUR CUSTOM CODE ONLY FOR BLACKBERRY 10 DEVICES
	};

	var loadWindowsPhoneOnlyFunctions = function (){
		//ADD HERE YOUR CUSTOM CODE ONLY FOR W-PHONE DEVICES
	};

	var loadiOSOnlyFunctions = function (){
		//ADD HERE YOUR CUSTOM CODE ONLY FOR IOS DEVICES
	};

	var loadTizenOnlyFunctions = function (){
		//ADD HERE YOUR CUSTOM CODE ONLY FOR TIZEN DEVICES
	};

}).apply(Mobile);