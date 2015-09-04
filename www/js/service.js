angular
    .module('starter.services', [])
    .service('xmpp', function($rootScope, $state,  $ionicScrollDelegate, $window, User, broadcast ) {
	
	var global_connect;
	var self = this;
	var state = $state;
	var roomJid;
	
        return {
 
            auth: function(jid, pwd, sid, rid) {
				
				var connect = self.global_connect;
				if(!connect)
				connect = new Strophe.Connection('http://klipzapp.com:7070/http-bind/');
 				self = this;
 				console.log("before connect.connect");	
                connect.connect(jid, pwd, function(status) {
 				
                    if (status === Strophe.Status.ATTACHED) {
						console.log("attached");
     
						
 
                    } else if (status === Strophe.Status.AUTHENTICATING) {
                        console.log("AUTHENTICATING");
                    } else if (status === Strophe.Status.AUTHFAIL) {
                        console.log("AUTHFAIL");
                    } else if (status === Strophe.Status.CONNECTING) {
                        console.log("CONNECTING");
                        console.log(jid+" "+pwd);	
                    } else if (status === Strophe.Status.DISCONNECTED) {
                        console.log("DISCONNECTED");
                    }
					
					else if (status === Strophe.Status.CONNECTED) {
					
						
                        console.log("CONNECTED");
						
						 //add "Hooks", or Listeners if you will
                        if( $window.localStorage['jid']==null) {
						
			
						
						
                      


					}

					$window.localStorage['jid'] = jid;
						$rootScope.myJID = $window.localStorage['jid'];
						$window.localStorage['pwd'] = pwd;
						$rootScope.myPWD = $window.localStorage['pwd'];

					  console.log("aggiungo gli handlers");
						
					  connect.addHandler(on_presence, null, "presence");
                      connect.addHandler(on_message, null, "message", "chat");
                      connect.addHandler(_notificationReceived, null, "message", "chat");
                      connect.send($pres());
					  console.log("handlers added");
					  $state.go('app.home');	
						

				 	  self.global_connect = connect;
				 	  
                      
						
						
						// "Hooks"
 
                function on_presence(presence) {
 
                        // handle presence
						console.log("presence");	
						console.log(presence);
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
					console.log(type);
					var elems = message.getElementsByTagName('body');
					var clientJid = Strophe.getBareJidFromJid(from); 
					if (type == "chat" || type == 'groupchat' && elems.length > 0) {
					var body = elems[0];
					
					var text = Strophe.getText(body);
					
					 console.log("E' arrivato un messaggio da: "+from+"/n"+"Testo: "+text	);
					 var array = {};
					 array.jid = clientJid;
					 array.text = text;
					 $rootScope.$apply(function() {

					 	if(type == "chat") {$rootScope.messages[clientJid].push(array);}
					 	else if (type == 'groupchat') {$rootScope.messages[self.roomJid].push(array);}
					
						$ionicScrollDelegate.scrollBottom(true);
					  });
					 
                        // handle incoming messages
                        // I have an array $rootScope.messages which is available throghout the whole app.
                    }    // e.g. $rootScope.messages.push(message);
 
                        return true
 
                    } // end of on_messsage
						
						
						
                    
						
			
            }
        })
 
    },
	
			 disconnect:  function() {
				var connect = self.global_connect;
				// connect.options.sync = true; // Switch to using synchronous requests since this is typically called onUnload.
				connect.flush();
				connect.disconnect();
	},
	
	
			register: function(email, password, nome, cognome, nickname, state) {
				var connect = self.global_connect;
				self = this;
				state = state;
				var user = {
					
					nome: nome,
					cognome: cognome,
					nickname: nickname,
					email: email,
					password: password
										
				}
				
				console.log(user);
				
				if(!connect)
				connect = new Strophe.Connection('http://klipzapp.com:7070/http-bind/');
				console.log(connect); 
				
				$window.localStorage['jid'] = null;
				$window.localStorage['pwd']  = null;


				var callback = function (status) {
					console.log(status);
					
				if (status === Strophe.Status.REGISTER) {
					console.log("registering");
					// fill out the fields
					connect.register.fields.username = user.nickname;
					connect.register.fields.plainPassword = user.password;
					connect.register.fields.password = user.password;
					connect.register.fields.name = user.nome+" "+user.cognome;
					connect.register.fields.email = user.nickname+"@klub.com";
					// calling submit will continue the registration process
					connect.register.submit();
					console.log(self.connect); 
				} else if (status === Strophe.Status.REGISTERED) {
					console.log("registered!");
					
					User.save({},user, 
					//user saved in db
					function(data){ console.log(data); 

					self.addHandlers(); 

					$window.localStorage['jid'] = user.nickname;
					$rootScope.myJID = $window.localStorage['jid'];
					$window.localStorage['pwd'] = user.password;
					$rootScope.myPWD = $window.localStorage['pwd'];	

					self.global_connect = connect;	

					state.go('app.home');	
					
						
                 
					}, 
					//error saving user in db
					function(data){ 
					console.log(data); 
					
					}
					);
					
					
					
				} else if (status === Strophe.Status.CONFLICT) {
					console.log("Contact already existed!");
				} else if (status === Strophe.Status.NOTACCEPTABLE) {
					console.log("Registration form not properly filled out.")
				} else if (status === Strophe.Status.REGIFAIL) {
					console.log("The Server does not support In-Band Registration")
				} else if (status === Strophe.Status.CONNECTED) {
					// do something after successful authentication
					console.log("connected!");
					

								
					
				} 
				
				else if (status = Strophe.Status.REGIFAIL){
					console.log("REGISTRATION FAILED: CODE "+status);
					
				}
				
				else {
					console.log("ELSE "+status);
					
				}
				
				};
				console.log("start registering");
				connect.register.connect('klub.com', callback, 60, 1);
				 
			 },

			 
			 
			  addHandlers: function() {
				 		
				 	  
                      
						
						
						// "Hooks"
 
                function on_presence(presence) {
 
                        // handle presence
						console.log("presence");	
						console.log(presence);
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
					console.log(type);
					var elems = message.getElementsByTagName('body');
					var clientJid = Strophe.getBareJidFromJid(from); 
					if (type == "chat" || type == 'groupchat' && elems.length > 0) {
					var body = elems[0];
					
					var text = Strophe.getText(body);
					
					 console.log("E' arrivato un messaggio da: "+from+"/n"+"Testo: "+text	);
					 var array = {};
					 array.jid = clientJid;
					 array.text = text;
					 $rootScope.$apply(function() {

					 	if(type == "chat") {$rootScope.messages[clientJid].push(array);}
					 	else if (type == 'groupchat') {$rootScope.messages[self.roomJid].push(array);}
					
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
	  return $resource('http://klipzapp.com/klub/v1/user');
	})
	
	.factory('UserLocation', function($resource) {
	  return $resource('http://klipzapp.com/klub/v1/location');
	})
	
	.factory('broadcast', function ($rootScope, $document) {
    var _events = {
        onPause: 'onPause',
        onResume: 'onResume'
    };
    $document.bind('resume', function () {
        _publish(_events.onResume, null);
    });
    $document.bind('pause', function () {
        _publish(_events.onPause, null);
    });

    function _publish(eventName, data) {
        $rootScope.$broadcast(eventName, data)
    }
    return {
        events: _events
    }
})
	
	
	.factory('Chats', function($rootScope) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Fabio Cingolani',
	jid: 'vahn',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Alessandro Lambiase',
    jid: 'alessandro',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Giulia Buccomino',
    jid: 'giulia',
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