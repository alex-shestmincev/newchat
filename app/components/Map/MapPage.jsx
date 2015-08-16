import React from "react";
import AppStore from "./../../store/AppStore";
import geolib from './../../lib/geolib';

export default class MapPage extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      name: this.props.name,
      numUsers: this.props.numUsers,
      chat: [],
      message: '',
      map: undefined,

      markers: [],
      infoWindows: [],
      latitude: '',
      longitude: ''
    }

    this.listenStore = this.listenStore.bind(this);
    this.newMessage = this.newMessage.bind(this);
  }


  componentWillMount(){
    AppStore.connectWith(this.listenStore);
    AppStore.onNewMessage(this.newMessage);
  }

  listenStore(){
    this.setState({
      name: AppStore.getUserName(),
      chat: AppStore.getChat(),
      numUsers: AppStore.getNumUsers(),
    });
  }

  newMessage(username, message, geo){
    let self = this;
    let {markers,infoWindows, map}  = this.state;
    let position = new google.maps.LatLng(geo.lat, geo.lng);

    var inWindow = map.getBounds().contains(position);
    if (!inWindow){
      console.log("Not in window");
      return;
    }

    var existMarker = ifMarkerExists(position);
    if (existMarker){
      existMarker.setAnimation(google.maps.Animation.BOUNCE);
      var infowindow = existMarker.infowindow;
      infowindow.setContent("<p>" + username + " > " + message + "<p>" + infowindow.getContent());
    }else{
      var marker = new google.maps.Marker({
        map:self.state.map,
        animation: google.maps.Animation.BOUNCE,
        position: position
      });

      var infoWindow = new google.maps.InfoWindow({
        content: "<p>" + username + " > " + message + "<p>"
      });

      var markerListener = google.maps.event.addListener(marker, 'click', toggleBounce);
      var windowListener = google.maps.event.addListener(infoWindow,'closeclick',removeAnimation);


      marker.infowindow = infoWindow;

      markers.push(marker);
      this.setState({
        markers: markers
      });
    }

    function ifMarkerExists(myLatLng){
      var marker;
      for(var x = 0; x < markers.length; x++) {
        if ( markers[x].getPosition().equals( myLatLng ) ) {
          marker = markers[x];
          break;
        }
      }
      return marker;
    }

    function toggleBounce() {
      removeAnimation();
      infoWindow.open(self.state.map,marker);
    }

    function removeAnimation(){
      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      }
    }



  }






  componentDidMount(){
    var self = this;

    if (typeof window === 'undefined'){
      return;
    }

    if (!this.state.map ) {
      geolib.geoposition(function(coords){
        var latitude = coords.latitude;
        var longitude = coords.longitude;

       var mapOptions = {
          zoom: 15,
          center: new google.maps.LatLng(latitude,longitude)
        };

        var map = new google.maps.Map(document.getElementById('map'), mapOptions);

        self.setState({
          latitude: latitude,
          longitude: longitude,
          map: map
        });

      });




    }
  }


  c1omponentDidUpdate(){
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
  }

  render(){

    return (
      <div className="map-holder">
        Name: {this.state.name},
        NumUsers: {this.state.numUsers},
        <div id="map" width="400" height="400"></div>
      </div>
    );
  }



}