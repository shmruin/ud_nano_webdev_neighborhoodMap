/* ======= Show Recommend Place ======= */

//Recommended list will be changed every time when user click "Refresh" button / Change "Category" / Click "Go" button

//TODO: Later these recommended places are filtered by some third-party rating,

var recommendedpPlaceList = [
    // {
    //     marker: "some_marker",
    //     name: "place_name",
    //     icon: "place_icon",
    //     rating: "place_rating",
    //     open: "place_opennow",
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
        //synchronized function after 'WatingListComplete'
        window.WatingListComplete().then(resetList);
    }

    var resetList = function() {
        self.recommendedPlaces.removeAll();

        recommendedpPlaceList.forEach(function(data) {
            self.recommendedPlaces.push(new recommendedItem(data));
        });
    }

    // list will be changed for the actions below
    this.categoryButtonClicked = recommendedListChange;
    this.searchTimeButtonClicked = recommendedListChange;
    this.categoryChanged = recommendedListChange;

    //init
    recommendedListChange();

    //filtering rearrangement
    this.filterTitle = ko.observable();
}

ko.applyBindings(new ViewModel());

