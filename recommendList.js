/* ======= Show Recommend Place ======= */

var recommendedpPlaceList = []

var recommended = function(data) {

}

var ViewModel = function() {

}









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