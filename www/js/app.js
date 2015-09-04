// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ngResource'])

.run(function($ionicPlatform, $rootScope, $window, xmpp, UserLocation) {
	

 

	 $rootScope.messages = {}; 
	 $rootScope.messages.composing = false; 
	 ( $window.localStorage['jid']!=null) ?  $rootScope.myJID = $window.localStorage['jid']: $rootScope.myJID = ""; 
   ( $window.localStorage['pwd']!=null) ?  $rootScope.myPWD = $window.localStorage['pwd']: $rootScope.myPWD = ""; 
	 
	
  $ionicPlatform.ready(function() {

     document.addEventListener("pause", function() {
       xmpp.disconnect();
      console.log("pausa");
      }, false);
      document.addEventListener("resume", function() {
      console.log("resumo - user: "+$rootScope.myJID+", pwd: "+$rootScope.myPWD);
      xmpp.auth($rootScope.myJID,$rootScope.myPWD, null, null);  
      }, false);

	  
   



 // Your app must execute AT LEAST ONE call for the current position via standard Cordova geolocation,
    //  in order to prompt the user for Location permission.
    window.navigator.geolocation.getCurrentPosition(function(location) {
        console.log('Location from Phonegap');
    });
 
    var bgGeo = window.plugins.backgroundGeoLocation;
 
    /**
    * This would be your own callback for Ajax-requests after POSTing background geolocation to your server.
    */
    var yourAjaxCallback = function(response) {
        ////
        // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
        //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        //
        //
        bgGeo.finish();
    };
 
    /**
    * This callback will be executed every time a geolocation is recorded in the background.
    */
    var callbackFn = function(location) {
        console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
        // Do your HTTP request here to POST location to your server.
        //
        //
        console.log(location);
   
        UserLocation.save({},location, 
          
          function(data){
            console.log(data);
          },

          function(error){
              console.log(location + " - "+ error);
          });


    


        yourAjaxCallback.call(this);
    };
 
    var failureFn = function(error) {
        console.log('BackgroundGeoLocation error');
    }
 
    // BackgroundGeoLocation is highly configurable.
    bgGeo.configure(callbackFn, failureFn, {
        desiredAccuracy: 10,
        locationTimeout: 300,
        stationaryRadius: 20,
        distanceFilter: 30,
        notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
        notificationText: 'ENABLED', // <-- android only, customize the text of the notification
        activityType: 'AutomotiveNavigation',
        debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
    });
 
    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    bgGeo.start();
 
    // If you wish to turn OFF background-tracking, call the #stop method.
    // bgGeo.stop()





	
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    abstract: true,
     views: {

      '': {
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
      },
      'listaContatti@app': {
        templateUrl: "templates/contacts-list.html",
        controller: 'ContactsCtrl'
      },
      'leftMenu@app': {
        templateUrl: "templates/left-menu.html",
        controller: 'leftMenuCtrl'
      }

     }

  })

  .state('app.home', {
    url: "/home",
    views: {
      'singleContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }

    }
  })



  .state('app.chat', {
    url: "/chat/:contactId",
  views: {
   'singleContent': {
    templateUrl: "templates/chat.html",
    controller: 'ChatDetailsCtrl'
    }
  }
})  


  .state('app.multichat', {
    url: "/multichat/:room",
  views: {
   'singleContent': {
    templateUrl: "templates/multichat.html",
    controller: 'MultiChatDetailsCtrl'
    }
  }
})  


 .state('app.userprofile', {
    url: "/userprofile/:userId",
  views: {
   'singleContent': {
    templateUrl: "templates/user-profile.html",
    controller: 'UserProfileCtrl'
    }
  }
})  

  .state('app.vendorprofile', {
    url: "/vendorprofile/:vendorId",
  views: {
   'singleContent': {
    templateUrl: "templates/vendor-profile.html",
    controller: 'VendorProfileCtrl'
    }
  }
})  


 .state('app.richieste', {
    url: "/richieste",
  views: {
   'singleContent': {
    templateUrl: "templates/richieste.html",
    controller: 'RichiesteCtrl'
    }
  }
})  
  
  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  })
  
  .state('register', {
    url: "/register",
    templateUrl: "templates/register.html",
    controller: 'RegisterCtrl'
  })
  
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
