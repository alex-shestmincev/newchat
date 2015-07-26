(function() {

  var geolib = {}

  var geoposition = function (callback) {
    if (typeof window !== 'undefined') {
      window.navigator.geolocation.getCurrentPosition(function (pos) {
        var crd = pos.coords;

        if (crd && typeof crd === "object") {
          callback({
            'latitude': crd.latitude,
            'longitude': crd.longitude
          });
        }
      });
    }
  }

  geolib.geoposition = geoposition;

  window.geolib = geolib;
})();