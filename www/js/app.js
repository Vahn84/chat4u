// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic-material', 'starter.controllers', 'starter.services', 'ngCordova', 'ngResource'])

.run(function($ionicPlatform, $rootScope, $window, xmpp, UserLocation, Chats, $cordovaStatusbar) {


 

 if(!$window.localStorage['myLastKnownLatitude']) {

     $window.localStorage['myLastKnownLatitude'] = 41.9025026;
      $window.localStorage['myLastKnownLongitude'] = 12.4964589;
 }
  


 $rootScope.messages = {}; 
 $rootScope.messages.composing = false; 

 console.log("localStorage['jid']",$window.localStorage['jid']);

 ( $window.localStorage['jid']!=null) ?  $rootScope.myJID = $window.localStorage['jid']: $rootScope.myJID = ""; 
 ( $window.localStorage['pwd']!=null) ?  $rootScope.myPWD = $window.localStorage['pwd']: $rootScope.myPWD = ""; 
 
  console.log("$rootScope.myJID",$rootScope.myJID);

$ionicPlatform.ready(function() {

  window.GcmPushPlugin.register(successHandler, errorHandler, {
      "senderId":"745741646899",
      "jsCallback":"onNotification"
  });

  function successHandler(result) {
    console.log("Token: " + result.gcm);
  }

  function errorHandler(error) {
    console.log("Error: " + error);
  }

  function onNotification(notification) {
    console.log("Event Received: " + notification); // { "extra": {"url" : "someurl.js" } } 
  }
 



   document.addEventListener("pause", function() {
     xmpp.disconnect();
    console.log("pausa");
    }, false);

    document.addEventListener("resign", function() {
     xmpp.disconnect();
    console.log("pausa");
    }, false);

    document.addEventListener("resume", function() {
    console.log("resumo - user: "+$rootScope.myJID+", pwd: "+$rootScope.myPWD);
    xmpp.resumeConnection($rootScope.myJID,$rootScope.myPWD, null, null, null);  
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
      console.log(location.latitude);

        $window.localStorage['myLastKnownLatitude'] = location.latitude;
          $window.localStorage['myLastKnownLongitude'] = location.longitude;
   
      
      if($window.localStorage['myId']!=null){
      var userLocation = {latitude: location.latitude, longitude: location.longitude, user_fk: $window.localStorage['myId']};

      UserLocation.save({},userLocation, 
        
        function(data){
          console.log(data);

        },

        function(error){
            console.log(userLocation + " - "+ error);
        });


  }


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
          cordova.plugins.Keyboard.disableScroll(true);
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if (window.StatusBar) {
    // org.apache.cordova.statusbar required
    StatusBar.styleDefault();
    $cordovaStatusbar.styleHex('#00A099') //red
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
  url: "/userprofile/:contactId",
views: {
 'singleContent': {
  templateUrl: "templates/user-profile.html",
  controller: 'UserProfileCtrl'
  }
}
})  

.state('app.userfriends', {
  url: "/userprofile/userfriends",
views: {
 'singleContent': {
  templateUrl: "templates/userfriends.html",
  controller: 'UserProfileFriendsCtrl'
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
},
params: {'titolo': null, 'uId': null},
}) 

.state('app.portafoglio', {
  url: "/vendorprofile/portafoglio",
views: {
 'singleContent': {
  templateUrl: "templates/portafoglio.html",
  controller: 'PortafoglioVendorProfileCtrl'
  }
}
})  

.state('app.chatWithUtentiVendor', {
  url: "/vendorprofile/chatWithUtentiVendor",
views: {
 'singleContent': {
  templateUrl: "templates/chatWithUtentiVendor.html",
  controller: 'ChatWithUtentiVendor'
  }
}
})  

.state('app.personalizzaVendor', {
  url: "/vendorprofile/personalizzaVendor",
views: {
 'singleContent': {
  templateUrl: "templates/personalizzaVendor.html",
  controller: 'CstmzeVendorProfileCtrl'
  }
}
}) 
.state('app.statisticheVendor', {
  url: "/vendorprofile/statisticheVendor",
views: {
 'singleContent': {
  templateUrl: "templates/statisticheVendor.html",
  controller: 'CstmzeVendorProfileCtrl'
  }
}
}) 
.state('app.nuovaComVendor', {
  url: "/vendorprofile/nuovaComVendor",
views: {
 'singleContent': {
  templateUrl: "templates/nuovaComVendor.html",
  controller: 'CstmzeVendorProfileCtrl'
  }
}
}) 
.state('app.utentiVendor', {
  url: "/vendorprofile/utentiVendor",
views: {
 'singleContent': {
  templateUrl: "templates/utentiVendor.html",
  controller: 'UtentiVendorProfileCtrl'
  }
}
})  

.state('app.nuovoEventoVendor', {
  url: "/vendorprofile/nuovoEventoVendor",
views: {
 'singleContent': {
  templateUrl: "templates/nuovoEventoVendor.html",
  controller: 'CstmzeVendorProfileCtrl'
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


.state('app.eventi', {
  url: "/eventi",
views: {
 'singleContent': {
  templateUrl: "templates/eventi.html",
  controller: 'EventiCtrl'
  }
}
})  


.state('app.notifiche', {
  url: "/notifiche",
views: {
 'singleContent': {
  templateUrl: "templates/notifiche.html",
  controller: 'NotificheCtrl'
  }
}
})  

.state('app.mypages', {
  url: "/mypages",
views: {
 'singleContent': {
  templateUrl: "templates/mypages.html",
  controller: 'MyPagesCtrl'
  }
}
})  

.state('app.settings', {
  url: "/settings",
views: {
 'singleContent': {
  templateUrl: "templates/settings.html",
  controller: 'SettingsCtrl'
  }
}
})  

.state('app.settingschat', {
  url: "/settings/settings-chat",
views: {
 'singleContent': {
  templateUrl: "templates/settings-chat.html",
  controller: 'SettingsCtrl'
  }
}
})  

.state('app.evento', {
  url: "/evento",
views: {
 'singleContent': {
  templateUrl: "templates/evento.html",
  controller: 'EventoCtrl'
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
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.backButton.previousTitleText(false).text('');


})

.directive('ngLastRepeat', function ($timeout) {
  return {
      restrict: 'A',
      link: function (scope, element, attr) {
          if (scope.$last === true) {
              $timeout(function () {
                  scope.$emit('ngLastRepeat'+ (attr.ngLastRepeat ? '.'+attr.ngLastRepeat : ''));
              });
          }
      }
  }
})

;
