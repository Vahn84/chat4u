angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

})



.controller('LoginCtrl', function($scope, $ionicModal, $timeout, $rootScope, xmpp, $state, $window) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.goRegister = function() {
	  $state.go('register');
  }
 
  // Form data for the login modal
  $scope.loginData = {};


  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
	console.log('Doing login', $scope.loginData);
	xmpp.auth($scope.loginData.username, $scope.loginData.password, null, null);  
    

  
  };

  if($window.localStorage['jid']!=null && $window.localStorage['pwd']!=null) {
  	console.log($rootScope.myJID+" - "+ $rootScope.myPWD);
  	 console.log('Doing login');
  	xmpp.auth($rootScope.myJID,$rootScope.myPWD, null, null);  
   
  }

})

.controller('RegisterCtrl', function($scope, $ionicModal, $timeout, $rootScope, xmpp, $state) {
  
  $scope.loginData = {};
  
  $scope.backToLogin = function() {
	  $state.go('login');
  }
  
   $scope.doRegister = function() {
	   $rootScope.loginData = {email: $scope.loginData.email, password: $scope.loginData.password,
	   nome: $scope.loginData.nome, cognome: $scope.loginData.cognome, nickname: $scope.loginData.nickname};
	   
	   xmpp.register($scope.loginData.email, $scope.loginData.password, $scope.loginData.nome, $scope.loginData.cognome, $scope.loginData.nickname, $state);
	   
   }
  
})


.controller('HomeCtrl', function($scope, $state, $stateParams, $ionicNavBarDelegate) {

	console.log($state.current.name);

})
	

.controller('ContactsCtrl', function($scope, Chats, $state) {
	

    $scope.contacts = Chats.all();
	  $scope.remove = function(chat) {
		Chats.remove(chat);
	  }

	  $scope.chatWithHim = function(contactId){
	  		$state.go('app.chat', { contactId: contactId })
	  }
})

.controller('ChatDetailsCtrl', function($scope, $rootScope, $state, $stateParams, Chats, $ionicScrollDelegate, $timeout, xmpp,  broadcast) {

	 console.log($state.current.name);

	 
	 //GETTING ALL CHAT CONTACTS (IT WILL BE REPLACED BY THE XMPP ROSTER)
	 $scope.contact = Chats.get($stateParams.contactId);
	 //INITIALIZING DOM MODELS
	 $scope.input = {};
	 $scope.chat = {};
	 //GETTING MY JID FROM GLOBAL SCOPE
	 var myJID = $rootScope.myJID;
	 
	 var timeoutPromise;
	 //GETTING MY CONTACT INFO BY MY JID (TEMPORARY)
	 $scope.myContact = Chats.getByJID(myJID);
	 
	 //GETTING THE CONTACT JID
	 var contactJid = $scope.contact.jid;
	 
	//GETTING THE 1TO1 ARRAY REFFERRING TO THE ACTUAL CONTACT THAT I'M CHATTING WITH 
	$scope.getChatMessages = function (){ $scope.chat = $rootScope.messages[contactJid]; return $scope.chat;}
	//GETTING TRUE OR FALSE IF THE CURRENT MESSAGE IS MINE OR NOT (USEFUL FOR MANIPULATING DOM LIST OF MESSAGES)
	$scope.isOwnMessage = function(jid){return (jid==myJID) ? true : false;	}	
	
	//CATCHING THE KEYDOWN ON THE TEXT AREA TO SEND "I'M TYPING" NOTIFICATION TO THE USER (NG-KEYPRESS NOT WORKING ON CHROME MOBILE)
		$scope.input.sendTyping = function () {
			
			connect.chatstates.sendComposing($scope.contact.jid, 'chat');
			console.log("typing");
			$timeout.cancel(timeoutPromise);
			 
			  timeoutPromise = $timeout(function() {
				connect.chatstates.sendPaused($scope.contact.jid, 'chat');
			  }, 1000);
		}
	 
	 
	   $scope.sendMessage = function() {
			
			if($scope.input.message.length){
				
					var sendMessageQuery = $msg({to: $scope.contact.jid, type: 'chat'}).c('body').t($scope.input.message);
					connect.send(sendMessageQuery);
					
					var message_text = $scope.input.message;
					var array = {};
					
					array.jid = myJID;
					array.text = message_text;
					
					$rootScope.messages[contactJid].push(array);
					$ionicScrollDelegate.scrollBottom(true);
						
					$scope.input.message="";
			}
		
	   }
	   
	  
	 
	 
	
	
});
