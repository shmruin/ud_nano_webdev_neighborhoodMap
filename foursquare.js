var foursquareSearch = {
    clientId: "N0FDMBFHFZRVECCRHSTMIKN2U0GUMM3RS304STXURFO5WKII",
    clientSecret: "CB3VV4FUA2UQHK1SEP1G23VF0JHUVEUQJONB3TWYYVWDJP4Y",
    location: "40.7243,-74.0018",
    name: "soho",
    intent: "match", // location & name is required to get best matched place. This might be useful.
    version: "20180115",
    doRequest: function() { //just for testing response
        var url = "https://api.foursquare.com/v2/venues/search";
        url += "?client_id=" + this.clientId;
        url += "&client_secret=" + this.clientSecret;
        url += "&ll=" + this.location;
        url += "&name=" + this.name;
        url += "&intent=" + this.intent
        url += "&v=" + this.version;
        this.getJson(url, function(data){
            console.log("doRequest: ",data);
        });
    },
    getJson: function(url, callback){ //get response by json format
        $.getJSON(url, function(data) {
          callback(data);
        });
    },
    setListElements: function() { //get response and return a list object for recommendedList
        var url = "https://api.foursquare.com/v2/venues/search";
        url += "?client_id=" + this.clientId;
        url += "&client_secret=" + this.clientSecret;
        url += "&ll=" + this.location;
        url += "&name=" + this.name;
        url += "&intent=" + this.intent
        url += "&v=" + this.version;
        this.getJson(url, function(data) {
            if(data['meta']['code'] !== 200) {
                console.log("Request Failed by response " + data['meta']['code']);
                return null;
            }

            var res = data['response']['venues'][0];
            if(res === undefined) {
                console.log("No response value here.");
                return null;
            }

            var res_photo = "http://www.bharatint.com/img/categories/our-cat-shop-image.png";
            var res_name = "NO_NAME";
            var res_menuURL = "NO_MENU";
            var res_phone = "-";
            var res_checkin = "-";

            if(res.hasOwnProperty('categories') && res['categories'][0].hasOwnProperty('icon')) {
                res_photo = res['categories'][0]['icon']['prefix'] + res['categories'][0]['icon']['suffix'];
            }
            if(res.hasOwnProperty('name')) {
                res_name = res['name'];
            }
            if(res.hasOwnProperty('menu')) {
                res_menuURL = res['menu']['url'];
            }
            if(res.hasOwnProperty('contact')) {
                res_phone = res['contact']['formattedPhone'];
            }
            if(res.hasOwnProperty('stats')) {
                res_checkin = res['stats']['checkinsCount'];
            }

            var component = {
                photo: res_photo,
                name: res_name,
                menu: res_menuURL,
                phone: res_phone,
                checkin: res_checkin
            }

            window.recommendedpPlaceList.push(component);
        });
    }
}