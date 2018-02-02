/* ======= Show Recommend Place ======= */

//Contents for the table left side
var recommendedpPlaceList = [
    // {
    //     marker: "some_marker",
    //     name: "place_name",
    //     icon: "place_icon",
    //     rating: "place_rating",
    //     open: "place_isOpenNow",
    // }
];

var recommendedItem = function(data) {
    var self = this;

    this.marker = data.marker;

    this.icon = ko.observable(data.icon);
    this.name = ko.observable(data.name);
    this.rating = ko.observable(data.rating);
    this.open = ko.observable(data.open);

    //click icon
    this.onClickIcon = function() {
        google.maps.event.trigger(self.marker, 'click');
    }
}

var ViewModel = function() {
    var self = this;

    //Connect recommendedPlaceList by observables
    this.recommendedPlaces = ko.observableArray([]);
    

    var recommendedListChange = function() {
        //List filling function works after 'WatingListComplete'
        window.WatingListComplete().then(resetList);
    }

    var resetList = function() {
        self.recommendedPlaces.removeAll();

        recommendedpPlaceList.forEach(function(data) {

            self.recommendedPlaces.push(new recommendedItem(data));
        });
    }

    //Marker reset when Category 'refresh' button is clicked
    this.categoryButtonClicked = function() {
        deleteMarkers();
        searchWithinCategory();
        setMarkerCurrentLocation(map.getCenter());
        recommendedListChange();
    };
    
    //Marker reset by minute + from A ...
    this.searchTimeButtonClicked = function() {
        deleteMarkers();
        window.callSearchWithinTime = true;
        var address = document.getElementById('search-within-time-text').value;
        OriginGeocoding(address);
        recommendedListChange();
    }

    //Marker reset when 'Category' is changed
    this.categoryChanged = function() {
        deleteMarkers();
        searchWithinCategory();
        setMarkerCurrentLocation(map.getCenter());
        recommendedListChange();
    };

    var modeTracks = function(name, value) {
        this.modeName = name;
        this.value = value;
    }

    //mode select observable
    this.mode = ko.observableArray([
        new modeTracks("Drive", "DRIVING"),
        new modeTracks("Walk", "WALKING"),
        new modeTracks("Bike", "BICYCLING"),
        new modeTracks("Transit Ride", "TRANSIT"),
    ])

    this.selectedMode = ko.observable();

    //NOT WORKING!
    this.sourcePlace = ko.observable();

    //init
    recommendedListChange();

    //filtering table items by their name when 'enter'
    this.filterTitle = ko.observable();

    ko.bindingHandlers.hotkey = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          var options = ko.utils.unwrapObservable(valueAccessor());
          
          if(typeof options === "object") {
            var trigger = options.trigger.toLowerCase();
            var action = options.action;
          } else {
            var trigger = options;
          }
          
          var enter = 13;
          
          $(document).on("keydown", function(e) {
            if(e.keyCode === enter) {
              // hotkey hit
              self.enterAction($(element)[0].value);
              e.preventDefault();
            }
          });
        }
    };

    this.enterAction = function(value) {

        var filtering = value;

        if(filtering === "") {
            self.categoryButtonClicked();
        }
        
        //1. filter recommendedpPlaceList
        var filteredList = recommendedpPlaceList.filter(function(item) {
            return item.name.includes(filtering);
        });

        recommendedpPlaceList = filteredList;

        //2. Call marker reset function in map.js with recommendedpPlaceList's marker info
        //   Reversal work of 'makeRecommendedpPlaceList'
        window.makeMarkerList(filtering);

        //3. Create table
        recommendedListChange();
    }
}

var vm = new ViewModel()
ko.applyBindings(vm);

