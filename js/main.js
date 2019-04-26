$(document).click(function(){
    $("#welcomeWrapper").hide();
});

var counties = L.layerGroup(Counties);

//style counties layer
function style(feature){
    return {
        fillColor: "grey",
        opacity: 0.5,
        weight: 0.5,
        color: "grey",
        fillOpacity: 0.4
    };
};


function createMap(){
    //create map object
    var map = L.map("map", {
        center: [43.7844, -88.7879],
        zoom: 6,
        minZoom: 3,
        maxZoom: 12
    });
    
    L.geoJSON(Counties, {style:style}).addTo(map);
    
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
    
    //layer control panel
    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);
    
    return map;
};


$(document).ready(createMap);