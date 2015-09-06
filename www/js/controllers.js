angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state) {
	
	$scope.goToProfile = function(contactId){

		$state.go('app.userprofile', {contactId: contactId});

	}
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
	xmpp.auth($scope.loginData.username+"@klipzapp.com", $scope.loginData.password, null, null);  
   
  
  };



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


.controller('HomeCtrl', function($scope, $state, $stateParams, $ionicNavBarDelegate, $ionicScrollDelegate) {
	
	console.log($state.current.name);

  $scope.goToProfile = function(type){
  	(type=="multi") ? $state.go("app.vendorprofile") : $state.go("app.userprofile");
  }

  $scope.chats_recenti = [{
    id: 0,
    name: 'Palestra',
	jid: 'vahn',
	type: 'multi',
	last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Alessandro Lambiase',
    jid: 'alessandro',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Comics Center',
    jid: 'giulia',
	type: 'multi',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 3,
    name: 'Giulia',
    jid: 'giulia',
	type: 'single',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 4,
    name: 'Ristorante',
    jid: 'giulia',
	type: 'multi',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 0,
    name: 'Palestra',
	jid: 'vahn',
	type: 'multi',
	last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Alessandro Lambiase',
    jid: 'alessandro',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Comics Center',
    jid: 'giulia',
	type: 'multi',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 3,
    name: 'Giulia',
    jid: 'giulia',
	type: 'single',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 4,
    name: 'Ristorante',
    jid: 'giulia',
	type: 'multi',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }];


})
	

.controller('ContactsCtrl', function($scope, Chats, $state) {
	
	var contact_list_state=  $state.current.name;
    $scope.contacts = Chats.all();
	  $scope.remove = function(chat) {
		Chats.remove(chat);
	  }

	  $scope.chatWithHim = function(contactId){
	  		console.log($state.current.name);
	  		$state.go('app.chat', { contactId: contactId, back_view:  contact_list_state});
	  }
})

.controller('leftMenuCtrl', function($scope, Chats, $state) {

	  $scope.goTo = function(state){ 		
	  		$state.go(state);
	  }
})

.controller('ChatDetailsCtrl', function($scope, $rootScope, $state, $stateParams, Chats, $ionicScrollDelegate, $timeout, xmpp,  $ionicHistory) {

	 console.log($stateParams.back_view);

	 //GETTING ALL CHAT CONTACTS (IT WILL BE REPLACED BY THE XMPP ROSTER)
	 $scope.contact = Chats.get($stateParams.contactId);
	 $scope.myTitle = '<a class="item item-avatar" href="#"> <img src="img/home/avatar.png"><h2>'+$scope.contact.name+'</h2></a>';
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
			  }, 300);
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
	   
	  
	 
	 
	
	
})


.controller('UserProfileCtrl', function($scope, Chats, $state, $stateParams) {
	
    $scope.contact = Chats.get($stateParams.contactId);


	

})


.controller('VendorProfileCtrl', function($scope, Chats, $state, $stateParams) {
	
   $scope.joinChat = function(room) {

		$state.go("app.multichat", {room: room});

		}


	

})

.controller('RichiesteCtrl', function($scope, Chats, $state, $stateParams) {
	


		

})
.controller('MultiChatDetailsCtrl', function($scope, $rootScope, $state, $stateParams, Chats, $ionicScrollDelegate, $timeout, xmpp,  $ionicHistory) {

	 console.log($stateParams.back_view);

	  var myJID = $rootScope.myJID;
	  $scope.myContact = Chats.getByJID(myJID);

	 //GETTING ALL CHAT CONTACTS (IT WILL BE REPLACED BY THE XMPP ROSTER)
	 $scope.roomJid = $stateParams.room+"@conference.klipzapp.com";
	 var roomJid =  $scope.roomJid ;
	 $scope.myTitle = '<a class="item item-avatar" href="#"> <img src="img/home/avatar.png"><h2>'+$stateParams.room+'</h2></a>';
	 //INITIALIZING DOM MODELS
	 $scope.input = {};
	 $scope.chat = {};
	 $rootScope.messages[roomJid] = [];
	 //GETTING MY JID FROM GLOBAL SCOPE
	 xmpp.roomJid = roomJid;
	 
	 var timeoutPromise;


	 var completeJid = {to:$scope.roomJid+'/'+ $rootScope.myJID}; 
	 var presence = $pres(completeJid); 
	 presence.c('x', {xmlns : 'http://jabber.org/protocol/muc#user'}, null); 
	 xmpp.global_connect.send(presence.tree());

	 
	//GETTING THE 1TO1 ARRAY REFFERRING TO THE ACTUAL CONTACT THAT I'M CHATTING WITH 
	$scope.getChatMessages = function (){ $scope.chat = $rootScope.messages[roomJid]; return $scope.chat;}
	//GETTING TRUE OR FALSE IF THE CURRENT MESSAGE IS MINE OR NOT (USEFUL FOR MANIPULATING DOM LIST OF MESSAGES)
	$scope.isOwnMessage = function(jid){return (jid==myJID) ? true : false;	}	
	
	
	 
	 
	   $scope.sendMessage = function() {
			
			if($scope.input.message.length){
				
					var sendMessageQuery = $msg({to: roomJid, type: 'groupchat'}).c('body').t($scope.input.message);
					xmpp.global_connect.send(sendMessageQuery);
					
					var message_text = $scope.input.message;
					var array = {};
					
					array.jid = myJID;
					array.text = message_text;
					
					// $rootScope.messages[roomJid].push(array);
					// $ionicScrollDelegate.scrollBottom(true);
						
					$scope.input.message="";
			}
		
	   }
	   
	  
	 
	 
	
	
});
