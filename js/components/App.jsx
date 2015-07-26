var App = React.createClass({

  getInitialState: function(){
    return {
      username: '',
      logged: false,
      numUsers: null
    }
  },

  componentWillMount: function(){
    AppStore.connectWith(this.listenStore);
  },

  listenStore: function(){
    this.setState({
      username: AppStore.getUserName(),
      numUsers: AppStore.getNumUsers(),
      logged: AppStore.getLogged()
    });
  },

  render: function() {
    if (this.state.username && this.state.logged){
      return ( <MapPage name={this.state.username} numUsers={this.state.numUsers} /> );
    }else{
      return ( <LoginPage /> );
    }
  }
});

React.render(
  <App />,
  document.getElementById('content')
);
