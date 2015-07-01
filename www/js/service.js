angular
    .module('starter.services', [])
    .service('xmpp', function($rootScope, $state,  $ionicScrollDelegate, $window, xmpp-addHandler) {
 
        return {
 
            auth: function(jid, pwd, sid, rid) {
 
              
 
                connect = new Strophe.Connection('http://klub.com:7070/http-bind/');
				
				
 
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
						
						xmpp-addHandler.add(connect);
			
            }
        }
 
    })
	
	
	.service('xmpp-register', function($rootScope, $state,  $ionicScrollDelegate, $window, User, xmpp-addHandler) {
 
        return {
			
			 register: function(email, password, nome, cognome, nickname) {
				 
				var user = {
					
					nome: nome,
					cognome: cognome,
					nickname: nickname,
					email: email,
					password: password
										
				}
				 
				connect = new Strophe.Connection();
				 
				 var callback = function (status) {
				if (status === Strophe.Status.REGISTER) {
					// fill out the fields
					connect.register.fields.username = nickname;
					connect.register.fields.password = password;
					// calling submit will continue the registration process
					connect.register.submit();
				} else if (status === Strophe.Status.REGISTERED) {
					console.log("registered!");
					
					User.save({},user, 
					//user saved in db
					function(data){ console.log(data); }, 
					//error saving user in db
					function(data){ console.log(data); }
					);
					
					connect.authenticate();
					
				} else if (status === Strophe.Status.CONFLICT) {
					console.log("Contact already existed!");
				} else if (status === Strophe.Status.NOTACCEPTABLE) {
					console.log("Registration form not properly filled out.")
				} else if (status === Strophe.Status.REGIFAIL) {
					console.log("The Server does not support In-Band Registration")
				} else if (status === Strophe.Status.CONNECTED) {
					// do something after successful authentication
					
					 if( $window.localStorage['jid']==null)
						$window.localStorage['jid'] = user.nickname;
						$rootScope.myJID = $window.localStorage['jid'];
                    
						xmpp-addHandler.add(connect);
						
					
				} else {
					// Do other stuff
				}
				
				};

				connect.register.connect('http://klub.com:7070/http-bind/', callback, 60, 1);
				 
			 }
			
		}
		
	})
	
		.service('xmpp-addHandler', function($rootScope, $state,  $ionicScrollDelegate, $window) {
 
        return {
			
			 add: function(connect) {
				 
					
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
	
	
	.factory('User', function($resource) {
	  return $resource('http://95.110.233.212/klub/v1/user/:id');
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