var MapPage = React.createClass({

  getInitialState: function(){
    return{
      name: '',
      numUsers: '',
      chat: [],
      message: '',
      map: undefined,

      latitude: '',
      longitude: ''
    }
  },

  componentWillMount: function(){
    this.setState({
      name: this.props.name,
      numUsers: this.props.numUsers
    });

    AppStore.connectWith(this.listenStore);
  },

  listenStore: function(){
    this.setState({
      name: AppStore.getUserName(),
      chat: AppStore.getChat(),
      numUsers: AppStore.getNumUsers(),
      typing: AppStore.getTyping(),
    });
  },

  componentDidMount: function(){
    var self = this;

    if (typeof window === 'undefined'){
      return;
    }

    if (!this.state.map ) {
      console.log(geolib);
      geolib.geoposition(function(coords){
        var latitude = coords.latitude;
        var longitude = coords.longitude;
        self.setState({
          latitude: latitude,
          longitude: longitude
        });

        var map = new GMaps({
          el: '#map',
          lat: latitude,
          lng: longitude,
          zoom: 15
        });

        self.setState({
          map: map
        });

      });




    }

    //var $ = window.$;
    //var height = $(window).height();
    //var heightHeader = $('.wr').height();
    //var heightSearchMenu = $('#FindPage .wrap-container').height();
    //var heightSearchMenuPad = $('#FindPage .wrap-container').css('padding-top').split('px');
    //var heightFooter = $('.footer').height();
    //var heightSum = height-heightHeader-heightSearchMenu-heightSearchMenuPad[0]-heightFooter;
    //$('.map-holder #map').css({
    //  height: heightSum
    //});
    //
    //$(window).resize(function(){
    //  var height = $(window).height();
    //  var heightHeader = $('.wr').height();
    //  var heightSearchMenu = $('#FindPage .wrap-container').height();
    //  var heightSearchMenuPad = $('#FindPage .wrap-container').css('padding-top').split('px');
    //  var heightFooter = $('.footer').height();
    //  var heightSum = height-heightHeader-heightSearchMenu-heightSearchMenuPad[0]-heightFooter;
    //  $('.map-holder #map').css({
    //    height: heightSum
    //  });
    //});

    //this.componentDidUpdate();
  },

  c1omponentDidUpdate: function(){
    var self = this;
    return;


    if(this.props.messageList && this.props.messageList.length) {
      if (this.props.messageList === this.state.messageList){
        return;
      }

      this.setState({
        messageList: this.props.messageList
      });

      var bounds = [];

      this.props.messageList.forEach(function(message) {

        var latlng = new google.maps.LatLng(message.loc.coordinates[1], message.loc.coordinates[0]);
        bounds.push(latlng);

        map.addMarker({
          lat: message.loc.coordinates[1],
          lng: message.loc.coordinates[0]
        });

        map.fitLatLngBounds(bounds);
      })
    }
  },

  render: function(){

    return (
      <div className="map-holder">
        <div id="map" width="400" height="400"></div>
      </div>
    );
  }



});