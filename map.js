var map;
var service;
var markers = [];
var placeMarkers = [];
var current_location = null;
var current_circle = null;
var sqInfowindow = null;

var callSearchWithinTime = false;
var CATEGORY_RADIUS = 10000;
var vmFlag = false;

var iconBase = 'http://labs.google.com/ridefinder/images/';
var icons = {
    places: {
        icon: iconBase + 'mm_20_green.png'
    },
    current: {
        icon: 'http://www.google.com/mapfiles/marker.png'
    }
};

function mapError() {
    alert("Error occur during loading google map!");
}

function initMap() {
    //current location
    var initLocation = new google.maps.LatLng(38.89500, -77.03667);

    //construct google map, setting the zoom and center
    map = new google.maps.Map(document.getElementById('map'), {
        center: initLocation,
        zoom: 13,
        mapTypeControl: false
    });

    var timeAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('search-within-time-text'));

    infowindow = new google.maps.InfoWindow();

    var geocoder = new google.maps.Geocoder();

    searchWithinCategory();
    setMarkerCurrentLocation(initLocation);
}

function hideMarkers() {
    for (var i = 0; i < markers.length; i++) {
        // markers[i].setMap(null);
        markers[i].setVisible(false);
    }
}

//Hide and Delete all markers in the map
function deleteMarkers() {
    hideMarkers();
    markers = [];
    deleteRecommendedList();
}

function deleteRecommendedList() {
    recommendedpPlaceList = [];
}

function openInfowindow(component) {
    var infowindow = new google.maps.InfoWindow({
        content: component.name()
    });
    infowindow.open(map, component.marker);
}

//Show current center with a small info window
function setMarkerCurrentLocation(location) {
    if (current_location !== null) current_location.setMap(null);

    current_location = new google.maps.Marker({
        map: map,
        icon: icons['current'].icon,
        position: location
    });

    var infowindow = new google.maps.InfoWindow({
        content: "This is the start point!"
    });
    infowindow.open(map, current_location);

    current_location.addListener('click', function() {
        if (current_location.getAnimation() !== null) {
            current_location.setAnimation(null);
        } else {
            current_location.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ current_location.setAnimation(null); }, 1300);
        }
    });

    if (current_circle != null) current_circle.setMap(null);
    drawCircle(map.getCenter(), CATEGORY_RADIUS);
}

function createPlaceMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        icon: icons['places'].icon,
        position: place.geometry.location,
        title: place.name,
        animation: google.maps.Animation.DROP,
    });

    //To make recommendedpPlaceList in recommendList.js
    var recommendedComponent = makeRecommendedpPlaceList(marker, place);

    google.maps.event.addListener(marker, 'click', function () {
        // infowindow.setContent(place.name);
        // infowindow.open(map, this);
        open4sqWindowInfo(recommendedComponent);
    });

    marker.addListener('click', function() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ marker.setAnimation(null); }, 1300);
        }
    });

    markers.push(marker);
}

//Draw a circle area that markers are searched from current location
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

//Callback function
function searchWithinCategory(center) {
    var initRadius = CATEGORY_RADIUS;
    var mode = document.getElementById('gift').value;
    var location;

    if (typeof center === 'undefined') location = map.getCenter();
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
            createPlaceMarker(results[i]);
        }
    }

    if (callSearchWithinTime) {
        searchWithinTime();
        callSearchWithinTime = false;
    }

    //After all markers are created
    vmFlag = true;
}

//Callback function
function searchWithinTime(here) {
    // Initialize the distance matrix service.
    var distanceMatrixService = new google.maps.DistanceMatrixService;
    var address = document.getElementById('search-within-time-text').value;

    console.log(address);

    // Check to make sure the place entered isn't blank.
    if (address == '') {
        window.alert('You must enter an address.');
    } else {
        hideMarkers();

        //This should be searched address
        var origin = address;

        var destinations = [];
        for (var i = 0; i < markers.length; i++) {
            destinations[i] = markers[i].position;
        }

        var mode = vm.selectedMode().value;

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

    var results = response.rows[0].elements;
    for (var i = 0; i < results.length; i++) {

        var element = results[i];

        if (element.status === "OK") {
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
                    content: durationText + ' away, ' + distanceText
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
    if (!atLeastOne) {
        window.alert('We could not find any locations within that distance!');
    }
}

function OriginGeocoding(newAddress) {
    var address = newAddress;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function (results, status) {
        if (status == 'OK') {
            var originGeocode = results[0].geometry.location;
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
    }, function (response, status) {
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

//make list in recommendList.js
function makeRecommendedpPlaceList(marker, place) {
    var recommendedComponent = {
        marker: marker,
        name: place.name,
        icon: place.icon,
        rating: place.rating,
        open: function() {
            if(place.hasOwnProperty('opening_hours')) {
                return place.opening_hours.open_now === true ? "Y" : "N";
            } else {
                return "-";
            }
        }(),
    };

    window.recommendedpPlaceList.push(recommendedComponent);

    return recommendedComponent;
}

//RecommendList actions should be done after this is satisfied
function WatingListComplete() {
    var defer = $.Deferred();

    var checkExist = setInterval(function() {
        if (vmFlag === true) {
           vmFlag = false;
           clearInterval(checkExist);
           defer.resolve(); //defer resolved
        }
     }, 50); // check every 50ms

    return defer;
}

//Show a special info window when recommendList items's icon is clicked.
function open4sqWindowInfo(recommendedItem) {

    console.log(recommendedItem);
 
    //Request to foursquare by recPlace info
    var lat = recommendedItem.marker.position.lat();
    var lng = recommendedItem.marker.position.lng();
    var name = recommendedItem.name;

    window.foursquareSearch['location'] = lat + ',' + lng;
    window.foursquareSearch['name'] = name;
    
    window.foursquareSearch.setListElements(recommendedItem.marker).then(function(res) {
        //Make and Open special window info of 4sq

        if(sqInfowindow !== null) {
            sqInfowindow.close();
        }
        
        if(res !== null) {
            sqInfowindow = new google.maps.InfoWindow({
                content: '<h5>Name: ' + res.name + '</h5>' +
                '<h5>Check-in: ' + res.checkin + '</h5>' +
                '<h5>Url: <a href="' + res.url + '" target="_blank">' + res.url + '</a></h5>' +
                '<div style="text-align: center;"><img src="' + res.photo[0] + '"/></div>'
            });
        } else {
            sqInfowindow = new google.maps.InfoWindow({
                content: name
            });
        }

        sqInfowindow.open(map, recommendedItem.marker);
        map.setCenter(recommendedItem.marker.position);
    });
}

//make marker in map.js
function makeMarkerList(filtering) {

    markers = markers.filter(function(item) {
        if(item.getTitle().includes(filtering)) {
            return true;
        } else {
            item.setMap(null);
        }
    });

    vmFlag = true;
}