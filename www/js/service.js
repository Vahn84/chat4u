angular
    .module('starter.services', [])
    .service('xmpp', function($rootScope, $state,  $ionicScrollDelegate, $window, User, broadcast, Chats ) {
	
	var global_connect;
	var self = this;
	var state = $state;
	var roomJid;
	
        return {
 
            auth: function(jid, pwd, sid, rid) {
				self = this;
				
				connect = new Strophe.Connection('http://klipzapp.com:7070/http-bind/');
 				
 				console.log("before connect.connect");	
                connect.connect(jid, pwd, function(status) {
 				
                    if (status === Strophe.Status.ATTACHED) {
						console.log("attached");
                        //add "Hooks", or Listeners if you will
                        
                        connect.addHandler(on_presence, null, "presence");
                        connect.addHandler(on_message, null, "message", "chat");

 
                        connect.send($pres());
						
     
						
 
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

					    $window.localStorage['jid'] = jid;
						$rootScope.myJID = $window.localStorage['jid'];
						$window.localStorage['pwd'] = pwd;
						$rootScope.myPWD = $window.localStorage['pwd'];

						  var nickname = Strophe.getNodeFromJid(jid); 	
						  
						  User.get({nickname: nickname}, function(response) {

						  		
						  		$window.localStorage['myId']= response.user.pk_user;
						  		console.log(response);
						  		$state.go('app.home'); 
						  		
						  });

						 
					  
						
					  self.addHandlers();

					  connect.send($pres());
					  

				 	  self.global_connect = connect;
				 	  
                      
						
						
						// "Hooks"
 
              
						
						
						
                    
						
			
            }
        })
 
    },


    resumeConnection: function(jid, pwd, sid, rid) {
				self = this;
				
				connect = new Strophe.Connection('http://klipzapp.com:7070/http-bind/');
 				
 				console.log("before connect.connect");	
                connect.connect(jid, pwd, function(status) {
 				
                    if (status === Strophe.Status.ATTACHED) {
						console.log("attached");
                        //add "Hooks", or Listeners if you will
                        
                        connect.addHandler(on_presence, null, "presence");
                        connect.addHandler(on_message, null, "message", "chat");

 
                        connect.send($pres());
						
     
						
 
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

					    $window.localStorage['jid'] = jid;
						$rootScope.myJID = $window.localStorage['jid'];
						$window.localStorage['pwd'] = pwd;
						$rootScope.myPWD = $window.localStorage['pwd'];

					  self.addHandlers();

					  connect.send($pres());
					  

				 	  self.global_connect = connect;
				 	  
                      
						
						
						// "Hooks"
 
              
						
						
						
                    
						
			
            }
        })
 
    },


    addHandlers: function() {

    			   console.log("aggiungo gli handlers");

    			   connect.addHandler(on_presence, null, "presence");
                   connect.addHandler(on_message, null, "message", "chat");
                   connect.addHandler(on_message, null, "message", "groupchat");
                   connect.addHandler(_notificationReceived, null, "message", "chat");
                     
				   console.log("handlers added");


				 		
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
                   		 if(!$rootScope.messages[clientJid]) $rootScope.messages[clientJid] = [];
						
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
					if (type == "chat" && elems.length > 0) {
					var body = elems[0];
					
					var text = Strophe.getText(body);
					
					 console.log("E' arrivato un messaggio da: "+from+"/n"+"Testo: "+text	);
					 var array = {};
					 array.jid = clientJid;
					 array.text = text;
					 $rootScope.$apply(function() {
					 if(!$rootScope.messages[clientJid]) $rootScope.messages[clientJid] = [];
					 $rootScope.messages[clientJid].push(array);
					 
						$ionicScrollDelegate.resize();
						$ionicScrollDelegate.scrollBottom(true);
					  });
					 
                        // handle incoming messages
                        // I have an array $rootScope.messages which is available throghout the whole app.
                    }    // e.g. $rootScope.messages.push(message);


                    else if (type == "groupchat" && elems.length > 0) {
					var body = elems[0];
					
					var senderJid = Strophe.getResourceFromJid(from);
					var mucJid =   Strophe.getNodeFromJid(from) + "@"+ Strophe.getDomainFromJid(from);
					console.log(mucJid);
				
					var text = Strophe.getText(body);
					
					 console.log("E' arrivato un messaggio da: "+from+"/n"+"Testo: "+text	);
					 var array = {};
					 var sender = Chats.getByJID(senderJid);
					 array.jid = senderJid;
					 array.name = sender.name;
					 array.text = text;
					 $rootScope.$apply(function() {
					 
					 $rootScope.messages[mucJid].push(array);
					 console.log($rootScope.messages[mucJid]);
					 $ionicScrollDelegate.resize();
					 $ionicScrollDelegate.scrollBottom(true);

					  });
					 
                        // handle incoming messages
                        // I have an array $rootScope.messages which is available throghout the whole app.
                    }    // e.g. $rootScope.messages.push(message);
 
                        return true
 
                    } // end of on_messsage
						
						
						
                    },
	
			 disconnect:  function() {
				var connect = self.global_connect;
				// connect.options.sync = true; // Switch to using synchronous requests since this is typically called onUnload.
				connect.flush();
				connect.disconnect();
	},
	
	
			register: function(email, password, nome, cognome, nickname) {
				
				self = this;
				
				var user = {
					
					nome: nome,
					cognome: cognome,
					nickname: nickname,
					email: email,
					password: password
										
				}
				
				console.log(user);

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
					connect.register.fields.email = user.email;
					// calling submit will continue the registration process
					connect.register.submit();
					 
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
					$window.localStorage['myId'] = data.lastId;
					$rootScope.myID = $window.localStorage['myId'];

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
				 
			 }


			
	
 }
 
	})

	.factory('User', function($resource) {
	  return $resource('http://klipzapp.com/klub/v1/user/:nickname');
	})
	
	.factory('UserLocation', function($resource) {
	  return $resource('http://klipzapp.com/klub/v1/location');
	})

	.factory('ListAroundMe', function($resource) {
	  return $resource('http://klipzapp.com/klub/v1/aroundme/:latitude/:longitude/:pk_user');
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
    id: 14,
    name: 'Fabio Cingolani',
	jid: 'vahn@klipzapp.com',
	type: 'business',
    face: 'img/avatar/1.png'
  }, {
    id: 27,
    name: 'Alessandro Lambiase',
    jid: 'alessandro@klipzapp.com',
    type: 'business',
    face: 'img/avatar/3.png'
  }, {
    id: 25,
    name: 'Giulia Buccomino',
    jid: 'giulia@klipzapp.com',
    type: 'user',
    face: 'img/avatar/4.png'
  }, {
    id: 28,
    name: 'Matteo Perconti',
    jid: 'matteo@klipzapp.com',
    type: 'business',
    face: 'img/avatar/1.png'
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

