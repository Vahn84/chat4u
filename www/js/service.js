angular
    .module('starter.services', [])
    .service('xmpp', function($rootScope, $state,  $ionicScrollDelegate, $window) {
 
        return {
 
            auth: function(jid, pwd, sid, rid) {
 
              
 
                connect = new Strophe.Connection('http://bosh.metajack.im:5280/xmpp-httpbind/');
				
				
 
                connect.connect(jid, pwd, function(status) {
 
                    if (status === Strophe.Status.ATTACHED) {
						console.log("attached");
                        //add "Hooks", or Listeners if you will
                        
                        connect.addHandler(on_presence, null, "presence");
                        connect.addHandler(on_message, null, "message", "chat");
 
                        connect.send($pres());
						
                        $state.go('app.contacts-list');
 
                    } else if (status === Strophe.Status.AUTHENTICATING) {
                        console.log("AUTHENTICATING");
                    } else if (status === Strophe.Status.AUTHFAIL) {
                        console.log("AUTHFAIL");
                    } else if (status === Strophe.Status.CONNECTING) {
                        console.log("CONNECTING");
                    } else if (status === Strophe.Status.DISCONNECTED) {
                        console.log("DISCONNECTED");
                    }
					
					else if (status === Strophe.Status.CONNECTED) {
					
						
                        console.log("CONNECTED");
						
						 //add "Hooks", or Listeners if you will
                        if( $window.localStorage['jid']==null)
						$window.localStorage['jid'] = jid;
						$rootScope.myJID = $window.localStorage['jid'];
                        connect.addHandler(on_presence, null, "presence");
                        connect.addHandler(on_message, null, "message", "chat");
                        
						
 
                        connect.send($pres());
						
                        $state.go('app.contacts-list');
						connect.addHandler(_notificationReceived, null, "message", "chat");
						
                    }
			
                })	;
 
                // "Hooks"
 
                function on_presence(presence) {
 
                        // handle presence
						console.log("presence");	
                        return true
 
                    } // end of presence
					
					
					function _notificationReceived(message) {
						var paused = message.getElementsByTagName('paused');
						var composing = message.getElementsByTagName('composing');
						
						var from = message.getAttribute('from');
						var clientJid = Strophe.getBareJidFromJid(from); 
                   
						
						if(composing.length>0) {
							console.log("composing");
							
							if(!$rootScope.messages.composing) {
								
									 var array = {};
									 array.jid = clientJid;
									 array.text = "Sto scrivendo...";
									 array.text.composing = 1;
									 $rootScope.$apply(function() {
										$rootScope.messages[clientJid].push(array);
										$ionicScrollDelegate.scrollBottom(true);
									  });	
								
								$rootScope.messages.composing = true;
							}
						}
						
						else if(paused.length>0) {
							console.log($rootScope.messages[clientJid].length);
							console.log("paused composing");
							$rootScope.$apply(function() {
							$rootScope.messages[clientJid].splice(($rootScope.messages[clientJid].length-1), 1 );
							});
							$rootScope.messages.composing = false;
						}
						
                        return true
 
                    } 
 
 
                function on_message(message) {
					
					var to = message.getAttribute('to');
					var from = message.getAttribute('from');
					var type = message.getAttribute('type');
					var elems = message.getElementsByTagName('body');
					var clientJid = Strophe.getBareJidFromJid(from); 
					if (type == "chat" && elems.length > 0) {
					var body = elems[0];
					
					var text = Strophe.getText(body);
					
					 console.log("E' arrivato un messaggio da: "+from+"/n"+"Testo: "+text	);
					 var array = {};
					 array.jid = clientJid;
					 array.text = text;
					 $rootScope.$apply(function() {
						$rootScope.messages[clientJid].push(array);
					
						$ionicScrollDelegate.scrollBottom(true);
					  });
					 
                        // handle incoming messages
                        // I have an array $rootScope.messages which is available throghout the whole app.
                    }    // e.g. $rootScope.messages.push(message);
 
                        return true
 
                    } // end of on_messsage
 
            }
        }
 
    })
	
	
	
	.factory('Chats', function($rootScope) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Fabio Cingolani',
	jid: 'vahn@chatme.im',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Alessandro Lambiase',
    jid: 'alessandro@chatme.im',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
			var contactJid = chats[i].jid;	
			$rootScope.messages[contactJid] = [];
          return chats[i];
        }
      }
      return null;
    },
	
	 getByJID: function(jid) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].jid === jid) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
	
	;