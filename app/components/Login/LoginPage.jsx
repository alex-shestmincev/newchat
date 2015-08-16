import React from "react";
import dispatcher from "./../../dispatcher.js";

export default class LoginPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      login: ''
    }
    this.loginChanges = this.loginChanges.bind(this);
    this.logInSubmit = this.logInSubmit.bind(this);
  }

  componentDidMount() {
    this.refs.login.getDOMNode().focus()
  }

  loginChanges(e){
    var login = e.target.value;
    this.setState({
      login: login
    });
  }

  logInSubmit(e){
    e.preventDefault();
    if (this.state.login){
      dispatcher.dispatch({name:"LOGIN",value:this.state.login});
    }
  }

  render() {


    return (
      <div className="loginForm">
        <form onSubmit={this.logInSubmit} >
          <label>What's your nickname?</label><br />
          <input type="text" ref="login" onChange={this.loginChanges} /><br />
        </form>
      </div>
    );
  }
}
