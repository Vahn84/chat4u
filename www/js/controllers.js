angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, xmpp) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};


  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
	  
	xmpp.auth($scope.loginData.username, $scope.loginData.password, null, null);  
    console.log('Doing login', $scope.loginData);

  
  };
})

.controller('ContactsCtrl', function($scope, Chats) {
	
	// Your app must execute AT LEAST ONE call for the current position via standard Cordova geolocation,
    //  in order to prompt the user for Location permission.
    window.navigator.geolocation.getCurrentPosition(function(location) {
        console.log('Location from Phonegap');
    });
	
    $scope.contacts = Chats.all();
	  $scope.remove = function(chat) {
		Chats.remove(chat);
	  }
})

.controller('ChatDetailsCtrl', function($scope, $rootScope, $stateParams, Chats) {
	 $scope.contact = Chats.get($stateParams.contactId);
	 $scope.input = {};
		
	 
	   $scope.sendMessage = function() {

			  var sendMessageQuery = $msg({to: $scope.contact.jid, type: 'chat'}).c('body').t($scope.input.message);
			 connect.send(sendMessageQuery);
	 
		
	   }
	 
	
	
});
