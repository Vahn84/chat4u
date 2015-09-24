angular
.module('starter.services', [])
.service('xmpp', function($rootScope, $state,  $ionicScrollDelegate, $window, User, broadcast, Chats ,$sce) {

 var global_connect;
 var self = this;
 var state = $state;
 var roomJid;

return {
// #GTA# ANCH0R:GET ID:1443089881.24494
getRoomJid:  function() {
			return roomJid;
		},

setRoomJid:  function(mucJid) {
			roomJid = mucJid;
			$rootScope.messages[roomJid] = {message:[], members: []};

		},

auth: function(jid, pwd, sid, rid) {
			self = this;

			connect = new Strophe.Connection('http://klipzapp.com:7070/http-bind/');

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

}
})

},

disconnect:  function() {
	var connect = self.global_connect;
	// connect.options.sync = true; // Switch to using synchronous requests since this is typically called onUnload.
	connect.flush();
	connect.disconnect();
},


register: function(email, password, nome, cognome, nickname) {

var	self = this;

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

},


resumeConnection: function(jid, pwd, sid, rid) {
	self = this;

	connect = new Strophe.Connection('http://klipzapp.com:7070/http-bind/');

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
			$window.localStorage['jid'] = jid;
			$rootScope.myJID = $window.localStorage['jid'];
			$window.localStorage['pwd'] = pwd;
			$rootScope.myPWD = $window.localStorage['pwd'];
			self.global_connect = connect;		
			self.addHandlers();

			connect.send($pres());

}
})

},


joinRoom: function(room, nick, history_attrs){
	console.log("joining room");
	var self = this;
	self.global_connect.muc.join(room, Strophe.getNodeFromJid(nick), self.onMsgHandler,  self.onGroupPresHandler, null, null,null, history_attrs);
	//self.getRoomMembers(room);
},

getRoomMembers: function(room){
	console.log("querying room members");
	var self = this;
	self.global_connect.muc.queryOccupants(room, onSuccessQuery, onErrorQuery);

	function onSuccessQuery(info){
		console.log(info);
		var query = info.getElementsByTagName('query');
		Strophe.forEachChild(query.item(0), 'item',
                function (item)
                {
                   $rootScope.messages[roomJid].members.push(item.getAttribute("jid"));
                }
           );
		console.log($rootScope.messages[roomJid].members);
	}
	function onErrorQuery(info){
		console.log("error querying occupants");
	}
},

leaveRoom: function(room, nick) {
	console.log("leaving room");
	var self = this;
	self.global_connect.muc.leave(room, nick, null, null)

},


addHandlers: function() {
	var self = this;
	console.log("aggiungo gli handlers");

	connect.addHandler(self.onPresHandler, null, "presence");
	connect.addHandler(self.onMsgHandler, null, "message", "chat");
	connect.addHandler(self.onMsgHandler, null, "message", "groupchat");
	connect.addHandler(self.onNotificationReceivedHandler, null, "message", "chat");
	connect.ping.addPingHandler(self.onPingHandler);

	console.log("handlers added");
},



onNotificationReceivedHandler: function(message){

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


},

onPresHandler: function(presence) {


	console.log("presence: "+presence);	
	return true
}, 


onGroupPresHandler: function(presence) {

// handle presence
presence.c('x', {xmlns : 'http://jabber.org/protocol/muc#user'}, null); 
connect.send(presence.tree());
console.log("groupchat presence: "+presence);	
return true
}, 

onMsgHandler: function(message) {

	var to = message.getAttribute('to');
	var from = message.getAttribute('from');
	var type = message.getAttribute('type');
	console.log(type);
	var elems = message.getElementsByTagName('body');
	var clientJid = Strophe.getBareJidFromJid(from); 
	if (type == "chat" && elems.length > 0) {
		var body = elems[0];

		var text = Strophe.getText(body);

		console.log("E' arrivato un messaggio da: "+from+"/n"+"Testo: "+decodeURIComponent(text));
		var array = {};
		array.jid = clientJid;
		array.text = decodeURIComponent(text);
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
	// console.log("Node: "+Strophe.getNodeFromJid(from));
	// console.log("Domain: "+Strophe.getDomainFromJid(from));
	// console.log("Resource: "+Strophe.getResourceFromJid(from));
	// console.log("BareJid: "+Strophe.getBareJidFromJid(from));
	var body = elems[0];
	console.log(message);
	var senderJid = Strophe.getResourceFromJid(from);
	var mucJid =   Strophe.getNodeFromJid(from) + "@"+ Strophe.getDomainFromJid(from);
	// console.log(mucJid);

	var text = Strophe.getText(body);

	console.log("E' arrivato un messaggio da: "+from+"/n"+"Testo: "+decodeURIComponent(text));
	var array = {};
	var roomJid = self.getRoomJid();
	array.jid = senderJid+"@klipzapp.com";
	array.nickname = senderJid;
	array.text = decodeURIComponent(text);

	$rootScope.$apply(function() {
		//console.log("mucJid "+mucJid);
		$rootScope.messages[mucJid].message.push(array);	
		//console.log($rootScope.messages[mucJid]);
		$ionicScrollDelegate.resize();
		$ionicScrollDelegate.scrollBottom(true);

	});

// handle incoming messages
// I have an array $rootScope.messages which is available throghout the whole app.
}    // e.g. $rootScope.messages.push(message);

return true

},

onPingHandler: function (iq) {
	console.log("pinged by: "+iq);
	connect.ping.pong(iq);
	return true;
},

onPongHandler: function(iq){
	console.log("ponged by: "+iq);
	return false;
},

sendPing: function(jid){
	var self = this;
	conn.ping.ping(
		jid,
		function (iq) {self.onPongHandler(iq);},
		function () { console.log('Failed!'); }, 
		3000);
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

