angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state) {
	
	$scope.goToProfile = function(contactId){

		$state.go('app.userprofile', {contactId: contactId});

	}
})



.controller('LoginCtrl', function($scope, $ionicModal, $timeout, $rootScope, xmpp, $state, $window, $ionicHistory) {


	 $ionicHistory.nextViewOptions({
      disableAnimate: false,
      disableBack: true
    });

  // Form data for the login modal
  $scope.loginData = {};

	 $scope.loginData.username = "matteo";
	 $scope.loginData.password = "perconti";

	 console.log("$rootScope.myJID", $rootScope.myJID);

	 // if($rootScope.myJID!=null &&  $rootScope.myPWD!=null && !$rootScope.isLogginIn) {
	 // 	xmpp.auth($rootScope.myJID, $rootScope.myPWD, null, null);  
	 // }
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.goRegister = function() {
	  $state.go('register');
  }
 



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
	   
	   xmpp.register($scope.loginData.email, $scope.loginData.password, $scope.loginData.nome, $scope.loginData.cognome, $scope.loginData.nickname);
	   
   }
  
})


.controller('HomeCtrl', function($scope, $state, $stateParams, $ionicNavBarDelegate, $ionicScrollDelegate, ionicMaterialInk,ionicMaterialMotion, ListAroundMe, $window) {
	
	var counter = 0;


	$scope.data = {
    activeButton : 0,
    filterArray: ['', 'user', 'pagina'],
    filter:  ''
  	}

  	$scope.activateButton = function(id) {
  		console.log(id);
  		$scope.data.activeButton= id;
  		$scope.data.filter = $scope.data.filterArray[id];

  	}

	ListAroundMe.get({latitude: $window.localStorage['myLastKnownLatitude'], longitude: $window.localStorage['myLastKnownLongitude'], 
    pk_user: $window.localStorage['myId']}, function(response) {

    	angular.forEach(response.items, function(value, key) {
		console.log("value "+ angular.fromJson(value));
		console.log("key "+ key);
    	  value.counter = counter;
		  this.push(value);

		  counter++;
		}, $scope.aroundMe);
   			
    })

	ionicMaterialInk.displayEffect();

	


 	 $scope.goToProfile = function(type, title, id){
  	(type=="pagina") ? $state.go("app.vendorprofile", {titolo: title, uId: id}) : $state.go("app.userprofile", {titolo: title, contactId: id});
  }

  $scope.aroundMe = [];

  $scope.chats_recenti = [ {
    id: 27,
    name: 'Alessandro Lambiase',
    jid: 'alessandro',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'img/avatar/3.png'
  },  {
    id: 25,
    name: 'Giulia',
    jid: 'giulia',
	type: 'single',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'img/avatar/4.png'
  }];


   $scope.chatWithHim = function(contactId){
	  		console.log($state.current.name);
	  		$state.go('app.chat', { contactId: contactId});
	  }

  
  $scope.doRefresh = function() {
    
  	 $scope.aroundMe.length = 0;

  	ListAroundMe.get({latitude: $window.localStorage['myLastKnownLatitude'], longitude: $window.localStorage['myLastKnownLongitude'], 
    pk_user: $window.localStorage['myId']}, function(response) {

    		console.log(response.items);

    	angular.forEach(response.items, function(value, key) {
		console.log("value "+ value);
		console.log("key "+ key);
    	  value.counter = counter;
		  this.push(value);

		  counter++;
		}, $scope.aroundMe);
    	
    	 console.log("arounde me: "+ $scope.aroundMe);
    	 $scope.$broadcast('scroll.refreshComplete');
   		 

    })

   
  };


})
	

.controller('ContactsCtrl', function($scope, Chats, $state, $window) {
	
	$scope.myId=$window.localStorage['myId'];

	var contact_list_state=  $state.current.name;
    $scope.contacts = Chats.all();
	  $scope.remove = function(chat) {
		Chats.remove(chat);
	  }

	  $scope.chatWithHim = function(contactId){
	  		console.log($state.current.name);
	  		$state.go('app.chat', { contactId: contactId});
	  }

	 $scope.goToProfile = function(id){
  		$state.go("app.userprofile", {contactId: id});
 	 }
})

.controller('leftMenuCtrl', function($scope, Chats, $state, $window, xmpp) {


	  $scope.myContact = Chats.get($window.localStorage['myId']);

	  $scope.goTo = function(state){ 		
	  		$state.go(state);
	  }

	  $scope.goToMyProfile = function(){ 		
	  		$state.go("app.userprofile", {contactId: $window.localStorage['myId']});
	  }

	  $scope.logOut = function(){
	  		$window.localStorage['jid']=null;
	  		$window.localStorage['pwd']=null;
	  		xmpp.disconnect();
	  		$state.go('login');
	  }
})

.controller('ChatDetailsCtrl', function($scope, $rootScope, $state, $stateParams, Chats, $ionicScrollDelegate, $timeout, xmpp,  $ionicHistory) {

	

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


.controller('UserProfileCtrl', function($scope, Chats, $state, $stateParams, $ionicModal, $window) {
	 console.log($stateParams.contactId);
    $scope.contact = Chats.get($stateParams.contactId);
    console.log($scope.contact);


	$scope.isProfileOwner = function(){

		return ($window.localStorage['myId']==$stateParams.contactId) ? true : false
	}


	 $ionicModal.fromTemplateUrl('templates/airmenu.html', {
	 	id: 1,
	    scope: $scope,
	    animation: 'fade-in'
	  }).then(function(modal) {
	    $scope.settingsModal = modal;
	  });


	 $ionicModal.fromTemplateUrl('templates/airrequest.html', {
	 	id: 2,
	    scope: $scope,
	    animation: 'fade-in'
	  }).then(function(modal) {
	    $scope.requestModal = modal;
	  });


	  $scope.openModal = function(index) {
      if (index == 1) $scope.settingsModal.show();
      else $scope.requestModal.show();
    };

      $scope.closeModal = function(index) {
      if (index == 1) $scope.settingsModal.hide();
      else $scope.requestModal.hide();
    };


	
	  $scope.goTo = function(state) {
	  		$scope.closeModal(1);
	  		$state.go(state);

	  }

	  $scope.chatWithHim = function(contactId){
	  		$state.go('app.chat', { contactId: contactId});
	  }


	

})


.controller('VendorProfileCtrl', function($scope, Chats, $state, $stateParams, $ionicModal, $window) {
	
	console.log($stateParams);
	$scope.title=$stateParams.titolo;
	$scope.profileId = $stateParams.uId;

	$scope.isBusinessOwner = function(){

		return ($scope.title=="Vigor Perconti" && $window.localStorage['myId']==28) ? true : false
	}

   $scope.joinChat = function(room) {

		$state.go("app.multichat", {room: room});

		}

    var showGroup= false;

	 $scope.toggleGroup = function(group) {
	    if ($scope.isGroupShown(group)) {
	      $scope.shownGroup = null;
	    } else {
	      $scope.shownGroup = group;
	    }
	  };
	  $scope.isGroupShown = function(group) {
	  	if(!showGroup) {
	  		group = showGroup;
	  		showGroup = true;
	  		return $scope.shownGroup === group;
	  	}
	  	else {return $scope.shownGroup === group;}
	    
	  };

	   $ionicModal.fromTemplateUrl('templates/airmenu.html', {
	    scope: $scope,
	    animation: 'fade-in'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });


	
	  $scope.goTo = function(state) {
	  		$scope.modal.hide();
	  		$state.go(state);

	  }
})

.controller('EventoCtrl', function($scope, Chats, $state, $stateParams, $window) {
	
	
})

.controller('CstmzeVendorProfileCtrl', function($scope, Chats, $state, $stateParams) {
	
	

})
.controller('UtentiVendorProfileCtrl', function($scope, Chats, $state, $stateParams) {
	
	 $scope.chats_recenti = [ {
    id: 1,
    name: 'Alessandro Lambiase',
    jid: 'alessandro',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },  {
    id: 3,
    name: 'Giulia',
    jid: 'giulia',
	type: 'single',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 1,
    name: 'Alessandro Lambiase',
    jid: 'alessandro',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },  {
    id: 3,
    name: 'Giulia',
    jid: 'giulia',
	type: 'single',
    last_chat: 'Fortuna vitrea est; tum cum splendet, fru...',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }];


})
.controller('RichiesteCtrl', function($scope, Chats, $state, $stateParams) {
	

})
.controller('NotificheCtrl', function($scope, Chats, $state, $stateParams) {
	

})
.controller('EventiCtrl', function($scope, Chats, $state, $stateParams) {
	

})	


.controller('MyPagesCtrl', function($scope, Chats, $state, $stateParams, $window) {
	
	console.log(($window.localStorage['myId']==14) ? true : false);

	$scope.isBusinessOwner = function(){

		return ($window.localStorage['myId']==14) ? true : false;
	}

	$scope.goToProfile = function(title, id){
  	 $state.go("app.vendorprofile", {titolo: title, uId: id});
  }

})

.controller('SettingsCtrl', function($scope, Chats, $state, $stateParams) {
	

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
