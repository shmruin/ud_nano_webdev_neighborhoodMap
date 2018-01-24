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
        //$.getJSON will return a Promise
        var res;
        return $.getJSON(url, function(data) {
         res = callback(data);
        }).then(function() {
            return res;
        });
    },
    setListElements: function(marker) { //get response and return a list object for recommendedList
        var url = "https://api.foursquare.com/v2/venues/search";
        url += "?client_id=" + this.clientId;
        url += "&client_secret=" + this.clientSecret;
        url += "&ll=" + this.location;
        url += "&name=" + this.name;
        url += "&intent=" + this.intent
        url += "&v=" + this.version;

        var self = this;

        return this.getJson(url, function(data) {

            var component = {};

            //Request error by 200
            if(data['meta']['code'] !== 200) {
                alert("Fail to get response from foursquare!");
                console.log("Request Failed by response " + data['meta']['code']);
                return null;
            }

            //No proper response here
            var res = data['response']['venues'][0];
            if(res === undefined) {
                alert("Fail to get response from foursquare!");
                console.log("No response value here.");
                return null;
            }

            var res_name = "Unknown";
            var res_url = "";
            var res_checkin = "";
            var res_marker = marker;

            if(res.hasOwnProperty('categories') && res['categories'][0].hasOwnProperty('icon')) {
                res_photo = res['categories'][0]['icon']['prefix'] + "bg_32" + res['categories'][0]['icon']['suffix'];
            }
            if(res.hasOwnProperty('name')) {
                res_name = res['name'];
            }
            if(res.hasOwnProperty('url')) {
                res_url = res['url']
            }
            if(res.hasOwnProperty('stats')) {
                res_checkin = res['stats']['checkinsCount'];
            }

            var id = res['id'];

            //Promise chain to get photo urls with a request
            return self.getPhotos(id).then(function(res_photo) {
                //data for info windows
                component['photo'] = res_photo;
                component['name'] = res_name;
                component['url'] = res_url;
                component['checkin'] = res_checkin;
                component['marker'] = res_marker;

                return component;
            })
            
        }).then(function(res) {
            console.log(res);
            return res;
        });;
    },
    getPhotos: function(id) {
        var self = this;

        var defer = $.Deferred();

        var url = "https://api.foursquare.com/v2/venues/" + id + "/photos";
        url += "?client_id=" + this.clientId;
        url += "&client_secret=" + this.clientSecret;
        url += "&v=" + this.version;

        return this.getJson(url, function(data) {

            var ans = [];

            //Request error by 200
            if(data['meta']['code'] !== 200) {
                console.log("Request Failed by response " + data['meta']['code']);
                return null;
            }

            //No proper response here
            var res = data['response']['photos']['items'];
            if(res === undefined) {
                console.log("No response value here.");
                return null;
            }

            for(var i = 0; i < Math.min(res.length, 10); i++) {
                //push photo url
                ans.push(res[i].prefix + "100x100" + res[i].suffix);
            }

            return ans;
        }).then(function(ans) {
            //This will work after callback complete
            defer.resolve();
            return ans;
        });
    }
}