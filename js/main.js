$(document).click(function(){
    $("#welcomeWrapper").hide();
});



//function to retrieve the data and place it on the map
function getData(map){
    //load the data from the pertussis json
    $.ajax("data/WI_PubSchools.geojson", {
        dataType: "json",
        success: function(response){
            
            //create marker options
            var geojsonMarkerOptions = {
                radius: 4,
                fillColor: "#8905B7",
                color: "#787878",
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.8
            };
			
            //create leaflet geojson layer
            L.geoJson(response, {
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map);
		}
    });
};



var counties = L.layerGroup(Counties);
var districts = L.layerGroup(Districts);



//style counties layer
function styleCounties(feature){
    return {
        fillColor: "grey",
        opacity: 0.5,
        weight: 0.5,
        color: "black",
        fillOpacity: 0.4
    };
};



//style districts layer
function styleDistricts(feature){
    return {
        fillColor: "grey",
        opacity: 0.5,
        weight: 0.5,
        color: "black",
        fillOpacity: 0.4
    };
};



function createMap(){
    //create map object
    var map = L.map("map", {
        center: [44.7844, -88.7879],
        zoom: 7,
        minZoom: 3,
        maxZoom: 12
    });
    
    
    var counties = new L.geoJSON(Counties, {style:styleCounties}).addTo(map);
    var districts = new L.geoJSON(Districts, {style:styleDistricts}).addTo(map);
    
    
    getData(map);
    

    //add base tile layer
    var light = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZW1pbGxpZ2FuIiwiYSI6ImNqczg0NWlxZTBia2U0NG1renZyZDR5YnUifQ.UxV3OqOsN6KuZsclo96yvQ', {
        //map attribution
        maxZoom: 18,
        //mapbox light
        id: 'mapbox.light',
        //my unique access token
        accessToken: 'pk.eyJ1IjoiZW1pbGxpZ2FuIiwiYSI6ImNqczg0NWlxZTBia2U0NG1renZyZDR5YnUifQ.UxV3OqOsN6KuZsclo96yvQ'
    }),
        streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZW1pbGxpZ2FuIiwiYSI6ImNqczg0NWlxZTBia2U0NG1renZyZDR5YnUifQ.UxV3OqOsN6KuZsclo96yvQ', {
        //map attribution
        maxZoom: 18,
        //mapbox streets
        id: 'mapbox.streets',
        //my unique access token
        accessToken: 'pk.eyJ1IjoiZW1pbGxpZ2FuIiwiYSI6ImNqczg0NWlxZTBia2U0NG1renZyZDR5YnUifQ.UxV3OqOsN6KuZsclo96yvQ'
    }).addTo(map);
    
    
    //add basemaps
    var baseMaps = {
        "Greyscale": light,
        "Streets": streets,
    };
    
    //add new data layer
    var overlayMaps = {
        "Unified School Districts": districts,
        "Counties": counties,
    };
    
    //layer control
    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);
    
    return map;
};




$(document).ready(createMap);
