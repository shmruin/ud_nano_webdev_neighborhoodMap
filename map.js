var map;

var service;

var markers = [];

var placeMarkers = [];

function initMap() {
    //current location
    var initLocation = new google.maps.LatLng(37.510271, 126.930542);
    var searchRadiust = 1000;

    //construct google map, setting the zoom and center
    map = new google.maps.Map(document.getElementById('map'), {
        center: initLocation,
        zoom: 13,
        //styles: styles,
        mapTypeControl: false
      });

    infowindow = new google.maps.InfoWindow();

    var initCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: initLocation,
        radius: searchRadiust
      });

    var request = {
        location: initLocation,
        radius: searchRadiust.toString(),
        type: 'book_store'
    }
    
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    var geocoder = new google.maps.Geocoder();

    document.getElementById('search-within-time').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });

    document.getElementById('search-within-time-here').addEventListener('click', function() {
        pickCurrentLocation();
    });
}

function callback(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
        for(var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('search-within-time-text').value;
    geocoder.geocode({address : address}, function(results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
}

function pickCurrentLocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infowindow.setPosition(pos);
          infowindow.setContent('Location found.');
          map.setCenter(pos);
        }, function() {
          handleLocationError(true, infowindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infowindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infowindow, pos) {
    infowindow.setPosition(pos);
    infowindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
}