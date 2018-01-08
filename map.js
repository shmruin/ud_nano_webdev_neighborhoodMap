var map;

var service;

var markers = [];

var current_location = null;

var current_circle = null;

var placeMarkers = [];

var callSearchWithinTime = false;

var CATEGORY_RADIUS = 7000;

var iconBase = 'http://labs.google.com/ridefinder/images/';
var icons = {
  places: {
    icon: iconBase + 'mm_20_green.png'
  },
  current: {
    icon: 'http://www.google.com/mapfiles/marker.png'
  }
};

function initMap() {
    //current location
    var initLocation = new google.maps.LatLng(38.89500, -77.03667);

    //construct google map, setting the zoom and center
    map = new google.maps.Map(document.getElementById('map'), {
        center: initLocation,
        zoom: 13,
        //styles: styles,
        mapTypeControl: false
    });

    var timeAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('search-within-time-text'));

    infowindow = new google.maps.InfoWindow();

    var geocoder = new google.maps.Geocoder();

    searchWithinCategory();
    setMarkerCurrentLocation(initLocation);

    document.getElementById('gift').addEventListener('change', function () {
        deleteMarkers();
        searchWithinCategory();
        setMarkerCurrentLocation(map.getCenter());
    });

    document.getElementById('search-within-category').addEventListener('click', function () {
        deleteMarkers();
        searchWithinCategory();
        setMarkerCurrentLocation(map.getCenter());
    });

    document.getElementById('search-within-time').addEventListener('click', function () {
        deleteMarkers();

        callSearchWithinTime = true;
        var address = document.getElementById('search-within-time-text').value;
        OriginGeocoding(address);
    });

    document.getElementById('search-within-time-here').addEventListener('click', function () {
        searchWithinTime(map.getCenter());
    });
}

function hideMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function deleteMarkers() {
    hideMarkers();
    markers = [];
}

function setMarkerCurrentLocation(location) {
    console.log(location);
    if(current_location !== null) current_location.setMap(null);

    current_location = new google.maps.Marker({
        map: map,
        icon: icons['current'].icon,
        position: location
    });

    var infowindow = new google.maps.InfoWindow({
        content: "This is the start point!"
    });
    infowindow.open(map, current_location);

    if(current_circle != null) current_circle.setMap(null);
    drawCircle(map.getCenter(), CATEGORY_RADIUS);
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        icon: icons['places'].icon,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });

    markers.push(marker);
}

function handleLocationError(browserHasGeolocation, infowindow, pos) {
    infowindow.setPosition(pos);
    infowindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function drawCircle(centerLocation, radius) {
    current_circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: centerLocation,
        radius: radius
    });
}

function searchWithinCategory(center) {
    var initRadius = CATEGORY_RADIUS;
    var mode = document.getElementById('gift').value;
    var location;

    if(typeof center === 'undefined') location = map.getCenter();
    else location = center;

    var request = {
        location: location,
        radius: initRadius.toString(),
        type: mode
    }

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, nearbySearchCallback);
}

function nearbySearchCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
        }
    }

    if(callSearchWithinTime) {
        searchWithinTime();
        callSearchWithinTime = false;
    }
}

function searchWithinTime(here) {
    // Initialize the distance matrix service.
    var distanceMatrixService = new google.maps.DistanceMatrixService;
    var address = document.getElementById('search-within-time-text').value;


    // Check to make sure the place entered isn't blank.
    if (address == '') {
        window.alert('You must enter an address.');
    } else {
        hideMarkers();

        var origin = address; //Should be searched address

        var destinations = [];
        for (var i = 0; i < markers.length; i++) {
            destinations[i] = markers[i].position;
        }

        var mode = document.getElementById('mode').value;

        distanceMatrixService.getDistanceMatrix({
            origins: [origin],
            destinations: destinations,
            travelMode: google.maps.TravelMode[mode],
            unitSystem: google.maps.UnitSystem.IMPERIAL,
        }, function (response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                window.alert('Error was: ' + status);
            } else {
                displayMarkersWithinTime(response);
            }
        });
    }
}

function displayMarkersWithinTime(response) {
    
    var maxDuration = document.getElementById('max-duration').value;
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;

    var atLeastOne = false;
    var maximumDistance = 0;
    for (var i = 0; i < destinations.length; i++) {
        var results = response.rows[0].elements;
        for (var j = 0; j < results.length; j++) {
            var element = results[j];
            if (element.status === "OK") {
                // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
                // the function to show markers within a user-entered DISTANCE, we would need the
                // value for distance, but for now we only need the text.
                var distanceText = element.distance.text;
                // Duration value is given in seconds so we make it MINUTES. We need both the value
                // and the text.
                var duration = element.duration.value / 60;
                var durationText = element.duration.text;
                if (duration <= maxDuration) {
                    //the origin [i] should = the markers[i]
                    markers[i].setMap(map);
                    atLeastOne = true;
                    // Create a mini infowindow to open immediately and contain the
                    // distance and duration
                    var infowindow = new google.maps.InfoWindow({
                        content: durationText + ' away, ' + distanceText +
                            '<div><input type=\"button\" value=\"View Route\" onclick =' +
                            '\"displayDirections(&quot;' + destinations[i] + '&quot;);\"></input></div>'
                    });
                    infowindow.open(map, markers[i]);
                    // Put this in so that this small window closes if the user clicks
                    // the marker, when the big infowindow opens
                    markers[i].infowindow = infowindow;
                    google.maps.event.addListener(markers[i], 'click', function () {
                        this.infowindow.close();
                    });
                }
                if (Number(distanceText.split(" ")[0]) > maximumDistance) {
                    maximumDistance = Number(distanceText.split(" ")[0]);
                }
            }
        }
        }
        if (!atLeastOne) {
            window.alert('We could not find any locations within that distance!');
        }
    }

function OriginGeocoding(newAddress) {
    var address = newAddress;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function (results, status) {
        if (status == 'OK') {
            var originGeocode =  results[0].geometry.location;
            map.setCenter(originGeocode);
            setMarkerCurrentLocation(originGeocode);
            searchWithinCategory(originGeocode);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function displayDirections(origin) {
    hideMarkers();
    var directionsService = new google.maps.DirectionsService;
    // Get the destination address from the user entered value.
    var destinationAddress =
        document.getElementById('search-within-time-text').value;
    // Get mode again from the user entered value.
    var mode = document.getElementById('mode').value;
    directionsService.route({
      // The origin is the passed in marker's position.
      origin: origin,
      // The destination is user entered address.
      destination: destinationAddress,
      travelMode: google.maps.TravelMode[mode]
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        var directionsDisplay = new google.maps.DirectionsRenderer({
          map: map,
          directions: response,
          draggable: true,
          polylineOptions: {
            strokeColor: 'green'
          }
        });
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }