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
    AppStore.onNewMessage(this.newMessage);
  },

  newMessage: function(username, message, geo){
    var self = this;
    var position = new google.maps.LatLng(geo.lat, geo.lng);

    var inWindow = this.state.map.getBounds().containsLatLng(position);
    if (!inWindow){
      console.log("Not in window");
      return;
    }

    var marker = new google.maps.Marker({
      map:self.state.map,
      animation: google.maps.Animation.BOUNCE,
      position: position
    });

    var infoWindow = new google.maps.InfoWindow({
      content: username + " > " + message
    });

    var markerListener = google.maps.event.addListener(marker, 'click', toggleBounce);
    var windowListener = google.maps.event.addListener(infoWindow,'closeclick',removeAnimation);

    function toggleBounce() {
      removeAnimation();
      infoWindow.open(self.state.map,marker);
    }

    function removeAnimation(){
      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      }
    }



  },




listenStore: function(){
    this.setState({
      name: AppStore.getUserName(),
      chat: AppStore.getChat(),
      numUsers: AppStore.getNumUsers(),
    });
  },

  componentDidMount: function(){
    var self = this;

    if (typeof window === 'undefined'){
      return;
    }

    if (!this.state.map ) {
      geolib.geoposition(function(coords){
        var latitude = coords.latitude;
        var longitude = coords.longitude;
        self.setState({
          latitude: latitude,
          longitude: longitude
        });

       var mapOptions = {
          zoom: 15,
          center: new google.maps.LatLng(latitude,longitude)
        };

        var map = new google.maps.Map(document.getElementById('map'), mapOptions);

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
        Name: {this.state.name},
        NumUsers: {this.state.numUsers},
        <div id="map" width="400" height="400"></div>
      </div>
    );
  }



});