var foursquareExplore = {
    clientId: "N0FDMBFHFZRVECCRHSTMIKN2U0GUMM3RS304STXURFO5WKII",
    clientSecret: "CB3VV4FUA2UQHK1SEP1G23VF0JHUVEUQJONB3TWYYVWDJP4Y",
    requestDate: "20170801",
    location: "40.7243,-74.0018",
    query: "coffee",
    limit: "1",
    redirectUrl: "http://localhost/foursquare/",
    doRequest: function() {
        var url = "https://api.foursquare.com/v2/venues/explore";
        url += "?client_id=" + this.clientId;
        url += "&client_secret=" + this.clientSecret;
        url += "&v=" + this.requestDate;
        url += "&ll=" + this.location;
        url += "&query=" + this.query;
        url += "&limit=" + this.limit;
        this.getJson(url, function(data){
            console.log("doRequest: ",data);
        });
    },
    getJson: function(url, callback){
        $.getJSON(url, function(data) {
          callback(data);
        });
    }
};

var foursquareSearch = {
    clientId: "N0FDMBFHFZRVECCRHSTMIKN2U0GUMM3RS304STXURFO5WKII",
    clientSecret: "CB3VV4FUA2UQHK1SEP1G23VF0JHUVEUQJONB3TWYYVWDJP4Y",
    location: "40.7243,-74.0018",
    name: "soho",
    intent: "match", // location & name is required to get best matched place. This might be useful.
    version: "20180115",
    doRequest: function() {
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
    getJson: function(url, callback){
        $.getJSON(url, function(data) {
          callback(data);
        });
    }
}