var ChatPage = React.createClass({

  getInitialState: function(){
    return {
      name: '',
      numUsers: '',
      chat: [],
      message: '',
      typing: {},

      user_scrolling: false
    }
  },

  componentWillMount: function(){
    this.setState({
      name: this.props.name,
      numUsers: this.props.numUsers,
    });

    AppStore.connectWith(this.listenStore);
    this.debounceTyping = _.debounce(this.typing, 500, {leading:true});
    this.debounceStopTyping = _.debounce(this.stopTyping, 2000 ,{leading:false});
  },

  componentDidMount: function() {
    this.refs.message.getDOMNode().focus();
    var self = this;

    var elem = document.getElementById('chatArea');
    elem.onscroll = function() {
      var scrolled = elem.pageYOffset || elem.scrollTop;

      var diff = elem.scrollHeight - elem.scrollTop - elem.offsetHeight;
      if (!self.state.user_scrolling && diff > 100){ // Если разница между высотой окна скроллинга и отступов меньше 100px
        self.setState({
          user_scrolling: true
        });
      }else if(self.state.user_scrolling && diff < 100){
        self.setState({
          user_scrolling: false
        });
      }
    }
  },


  componentDidUpdate(){
    if (!this.state.user_scrolling){
      setTimeout(function() {
        var elem = document.getElementById('chatArea');
        elem.scrollTop = elem.scrollHeight;
      }, 500);
    }
  },

  listenStore: function(){
    this.setState({
      name: AppStore.getUserName(),
      chat: AppStore.getChat(),
      numUsers: AppStore.getNumUsers(),
      typing: AppStore.getTyping(),
    });
  },

  sendMessage: function(e){
    e.preventDefault();
    dispatcher.dispatch({name:"MY_NEW_MESSAGE", message: this.state.message});
    this.clearMessageAndPrint()
  },

  messageChanges: function(e){
    var self = this;
    var message = e.target.value;
    this.setState({
      message: message
    });
    this.debounceTyping();
    this.debounceStopTyping();
  },

  typing: function(){
    dispatcher.dispatch({name:"I_TYPING"});
  },

  stopTyping: function(){
    dispatcher.dispatch({name:"I_STOP_TYPING"});
  },

  clearMessageAndPrint: function(){
    AppStore.newMessage("я", this.state.message);
    this.setState({message: ""});
  },

  render: function() {

    var list = [];
    for (var i=0; i<this.state.chat.length;i++){

      list.push(<ChatItem message={this.state.chat[i]} />);
    }

    var typing = [];
    _.forEach(this.state.typing, function(n,username){
      typing.push(username);
    });

    var typeing_elem = typing.length ? (<li>{typing.join(", ")} typing...</li>) : "";

    return (
      <ul className="pages">
        <li className="item chat page">
          Name: {this.state.name},
          NumUsers: {this.state.numUsers},

          <div id="chatArea">
            <ul className="messages">
              {list}
              {typeing_elem}
            </ul>


          </div>
        </li>
        <li className="item">
          <form className="formMessage" onSubmit={this.sendMessage}>
            <input className="inputMessage" type="text" ref="message" onChange={this.messageChanges} value={this.state.message} />
          </form>
        </li>

      </ul>
    );
  }
});