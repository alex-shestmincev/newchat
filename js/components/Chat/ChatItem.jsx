var ChatItem = React.createClass({

  getInitialState: function(){
    return {
      message: this.props.message,
      url: ""
    }
  },

  componentWillMount: function(){
    var re = /https?:\/\/[\S]+/g;
    var self = this;
    var res = this.props.message.match(re);
    if (res){
      res.forEach(function(url){
        AppStore.connectWith(function(){
          self.setState({
            url: AppStore.getImage(url)
          });
        });
        setTimeout(function(){
          dispatcher.dispatch({name:"CHECK_IMAGE", src:url});
        },0);

      });
    }


  },

  render: function() {

    var url;
    if (this.state.url){
      url = <p><img src={this.state.url} className="chatImg" /></p>
    }

    return (
      <li> {this.state.message} {url}</li>
    );
  }
});