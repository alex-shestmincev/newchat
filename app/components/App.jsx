import React from "react";
import api from './../api/api';
import LoginPage from "./Login/LoginPage";
import MapPage from "./Map/MapPage";
import AppStore from "./../store/AppStore";

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      username: '',
      logged: false,
      numUsers: null
    }

    this.listenStore = this.listenStore.bind(this);
  }

  componentWillMount(){
    AppStore.connectWith(this.listenStore);
  }

  listenStore(){
    this.setState({
      username: AppStore.getUserName(),
      numUsers: AppStore.getNumUsers(),
      logged: AppStore.getLogged()
    });
  }

  render() {
    let {username, logged} = this.state;

    if (this.state.username && this.state.logged){
      return ( <MapPage name={this.state.username} numUsers={this.state.numUsers} /> );
    }else{
      return ( <LoginPage /> );
    }
  }
}

React.render(
  <App />,
  document.getElementById('content')
);
