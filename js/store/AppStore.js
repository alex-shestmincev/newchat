(function() {

  var AppStore = {

    // PRIVATE

    _username: '',
    _logged: false,
    _numUsers: null,
    _chat: [],
    _listeners: [],
    _listeners_new_message: [],
    _typing: {},
    _valid_images: {},

    pushChat: function(message){
      console.log(message);
      this._chat.push(message);
      this.storeChanges();

    },

    storeChanges: function(){
      this._listeners.forEach(function(callback){
        callback();
      });
    },

    actionNewMessage: function(username,message){
      var geo = {
        lat: 50.0312804 + username.length * 0.001,
        lng: 36.2274277 + username.length * 0.001
      }
      this._listeners_new_message.forEach(function(callback){
        callback(username, message, geo);
      });
    },

    //PRIVATE


    // API
    getUserName: function(){
      return this._username;
    },

    getNumUsers: function(){
      return this._numUsers;
    },

    getLogged: function(){
      return this._logged;
    },

    isLogged: function(){
      return this._logged;
    },

    getChat: function(){
      return this._chat;
    },

    getTyping: function(){
      return this._typing;
    },

    connectWith: function(callback){
      this._listeners.push(callback);
    },

    onNewMessage: function(callback){
      this._listeners_new_message.push(callback);
    },


    // API

    // FOR DISPATCHER
    newMessage: function(username, message){
      this.pushChat(username + "> " + message);
      this.actionNewMessage(username, message);
    },

    newTyping: function(username){
      var self = this;
      this._typing[username] = username;
      setTimeout(function(){
        self.delTyping(username);
      },10000);
    },

    delTyping: function(username){
      delete this._typing[username];
    },

    joinedUser: function(name){
      this.pushChat("User '" + name + "' has joined");
    },

    leftUser: function(name){
      this.pushChat("User '" + name + "' has left");
    },

    setUserName: function(name){
      this._username = name;
    },

    setNumUsers: function(numUsers){
      this._numUsers = numUsers;
    },

    setLogged: function(logged){
      this._logged = logged;
    },

    addImage: function(src){
      this._valid_images[src] = src;
    },

    getImage: function(src){
      if (this._valid_images[src]){
       return this._valid_images[src];
      }
      return "";
    },

    userTyping: function(username){
      this.newTyping(username);
    },

    userStopTyping: function(username){
      this.delTyping(username);
    }

    // FOR DISPATCHER




  };


  dispatcher.register(function(event){
    switch (event.name){


      case "USERS_NEW_MESSAGE":
        AppStore.newMessage(event.username,event.message);
        break;

      case "USER_JOINED":
        AppStore.joinedUser(event.username);
        break;
      case "USER_LEFT":
        AppStore.leftUser(event.username);
        break;

      case "LOGIN":
        AppStore.setUserName(event.value);
        AppStore.storeChanges();
        break;
      case "LOGGED":
        AppStore.setNumUsers(event.value);
        AppStore.setLogged(true);
        AppStore.storeChanges();
        break;
      case "USER_TYPING":
        AppStore.userTyping(event.username);
        AppStore.storeChanges();
        break;
      case "USER_STOP_TYPING":
        AppStore.userStopTyping(event.username);
        AppStore.storeChanges();
        break;
      case "CHECK_IMAGE_TRUE":
        AppStore.addImage(event.src);
        AppStore.storeChanges();
    }
  });


  window.AppStore = AppStore;
})();