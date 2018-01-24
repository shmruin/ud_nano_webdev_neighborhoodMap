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
        window.open4sqWindowInfo(self);
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

    //list will be changed by the actions below
    this.categoryButtonClicked = recommendedListChange;
    this.searchTimeButtonClicked = recommendedListChange;
    this.categoryChanged = recommendedListChange;

    //init
    recommendedListChange();

    //filtering table items by their name
    this.filterTitle = ko.observable();

    this.searchKeyUp = function (d, e) {
        if (e.keyCode == 13) { //if 'enter' key

            var filtering = self.filterTitle();
            
            //1. filter recommendedpPlaceList
            recommendedpPlaceList = recommendedpPlaceList.filter(function(item) {
                return item.name.includes(filtering);
            });

            //2. Call marker reset function in map.js with recommendedpPlaceList's marker info
            //   Reversal work of 'makeRecommendedpPlaceList'
            window.makeMarkerList(recommendedpPlaceList);

            //3. Create table
            recommendedListChange();
        }
    }
}

ko.applyBindings(new ViewModel());

