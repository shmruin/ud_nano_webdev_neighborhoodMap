# ud_nano_webdev_neighborhoodMap

![alt text](screenshots/neighborhood_map.png "ud_nano_webdev_neighborhoodMap View")

# Introduction
This project provides a simple app for 'Neighborhood Map' project in Udacity.

 - Find A best gift shop yourself with 'Neighborhood Map'! -
 - Liquor, Flower, Book, Jewel nearby! -

This project meets up the main properties below.

* App Functionality - Filter location / List View / Map and Markers
* App Architecture - Knockout.js structure library is included in recommendList.js
* Asynchronous Data Usage - Asynchronous approach for linking among google map api, table list view, and foursquare api
* Location Details Functionality - google map info window with foursquare tastes.
* Documentation - Readme.md, comments, code quality

# Files and Folder

* `neighborhood.html` - Main html file of the page. The only html page for this project.
* `map.js` - Dealing with google map javascript api. Place library is also included.
* `recommendList.js` - Make the list table and filter left side as well as some button/change actions. Knockout.js.
* `foursquare.js` - foursquare api side for google info window.
* `style.css` - CSS file for `neighborhood.html`.
* `knockout-3.4.2.js` - Knockout.js file
* `screenshots` - screenshot folder

# Environment

* Tested in `window 10`, `Chrome` environment

# How to Run & Features

* Run neighborhood.html to use this program.
* First location is set to 'Washington', US
* Gift category(Liquor, Flower, Book, Jewel) can be selected - the marker immediately change, or you can just 'refresh' at any place.
* Secondly, distance matrix also works; you can find some category-base shops in proper time from specific place.
* the markers shown in the map are listed left below, as a table. It also gives some more infomations.
* If you click the 'Icon' in any table item, it directly show some detail info window (foursquare response).
* This table has filtering function. Just put the word on the text input and Enter. Table and markers will be reset.
* This is it! Hope you have a fun with this program!

