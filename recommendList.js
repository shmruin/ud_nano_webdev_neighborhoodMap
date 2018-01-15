/* ======= Show Recommend Place ======= */

//Recommended list will be changed every time when user click "Refresh" button / Change "Category" / Click "Go" button

//TODO: Later these recommended places are filtered by some third-party rating,

var test_photo = "http://www.bharatint.com/img/categories/our-cat-shop-image.png";
var test_name = "Bob";
var test_time = "9:00 - 6:00";
var test_likes = "45";
var test_reviews = "5";

var test_photo1 = "http://www.bharatint.com/img/categories/our-cat-shop-image.png";
var test_name1 = "robin";
var test_time1 = "10:00 - 6:00";
var test_likes1 = "77";
var test_reviews1 = "17";

var recommendedpPlaceList = [
    {
        photo: test_photo, //foursquare Get Details of a Venue
        name: test_name, //foursquare Get Details of a Venue
        time: test_time, //foursquare Get Details of a Venue
        likes: test_likes, //foursquare Get Details of a Venue
        reviews: test_reviews //foursquare Get Details of a Venue
    },
    {
        photo: test_photo1,
        name: test_name1,
        time: test_time1,
        likes: test_likes1,
        reviews: test_reviews1
    }
];

var recommendedItem = function(data) {
    this.photo = ko.observable(data.photo);
    this.name = ko.observable(data.name);
    this.time = ko.observable(data.time);
    this.rating = ko.observable(data.rating);
    this.reviews = ko.observable(data.reviews);

    this.gotoPlace = function() {
        alert("goto is clicked!!!");
    }
}

var ViewModel = function() {
    var self = this;

    //Make recommendedPlaceList with google map and third-party api
    //window.foursquareExplore.doRequest();
    window.foursquareSearch.doRequest();

    //Connect recommendedPlaceList by observables
    this.recommendedPlaces = ko.observableArray([]);

    recommendedpPlaceList.forEach(function(data) {
         self.recommendedPlaces.push(new recommendedItem(data));
    })

    //sorting rearrangement
    this.sorting = ko.observableArray(['rating', 'newly', 'reviews']);

    //filtering rearrangement
    this.filterTitle = ko.observable();
}

ko.applyBindings(new ViewModel());







/* ======= By KnockOut.js ======= */

// var initialGiftPoints = [
//     {
//         clickCount : 0,
//         name : "meow",
//         imgSrc : "https://lh3.ggpht.com/nlI91wYNCrjjNy5f-S3CmVehIBM4cprx-JFWOztLk7vFlhYuFR6YnxcT446AvxYg4Ab7M1Fy0twaOCWYcUk=s0#w=640&h=426",
//         nickname: ['Shabby', 'Sooni', 'The king of the wonderful world', 'Damnit'],
//     },
//     {
//         clickCount : 0,
//         name : "rose",
//         imgSrc : "https://lh3.ggpht.com/kixazxoJ2ufl3ACj2I85Xsy-Rfog97BM75ZiLaX02KgeYramAEqlEHqPC3rKqdQj4C1VFnXXryadFs1J9A=s0#w=640&h=496",
//         nickname: ['Coon'],
//     },
//     {
//         clickCount : 0,
//         name : "clara",
//         imgSrc : "https://lh5.ggpht.com/LfjkdmOKkGLvCt-VuRlWGjAjXqTBrPjRsokTNKBtCh8IFPRetGaXIpTQGE2e7ZCUaG2azKNkz38KkbM_emA=s0#w=640&h=454",
//         nickname: ['malty', 'NOO', 'CrazyCat'],
//     },
//     {
//         clickCount : 0,
//         name : "bob",
//         imgSrc : "https://static.pexels.com/photos/20787/pexels-photo.jpg",
//         nickname: []
//     },
//     {
//         clickCount : 0,
//         name : "pertu",
//         imgSrc : "https://news.nationalgeographic.com/content/dam/news/photos/000/755/75552.ngsversion.1422285553360.adapt.1900.1.jpg",
//         nickname: ['Ruby']
//     }
// ]


// var Cat = function(data) {
//     this.clickCount = ko.observable(data.clickCount);
//     this.name = ko.observable(data.name);
//     this.imgSrc = ko.observable(data.imgSrc);
//     this.nickname = ko.observableArray(data.nickname);
   
//     this.title = ko.computed(function() {
//         var self = this;

//         var title;
//         var clicks = this.clickCount();
//         if(clicks < 10) {
//             title = 'newborn';
//         } else {
//             title = 'elder';
//         }
//         return title;
//     }, this);
// }

// var ViewModel = function() {
//     var self = this;

//     this.catList = ko.observableArray([]);

//     initialCats.forEach(function(catItem) {
//         self.catList.push(new Cat(catItem));
//     })

//     this.currentCat = ko.observable( this.catList()[0] );
    
//     this.incrementCounter = function() {
//         this.clickCount(this.clickCount() + 1);
//     }

//     this.changeCat = function(data) {
//         self.currentCat( data );
//     }
// }

// ko.applyBindings(new ViewModel());