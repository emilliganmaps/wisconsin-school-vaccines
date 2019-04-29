$(document).click(function(){
    $("#welcomeWrapper").hide();
});


//function to retrieve the data and place it on the map
function getData(map){
    //load the data from the pertussis json
    $.ajax("data/WI_PubSchools_VaxData.geojson", {
        dataType: "json",
        success: function(response){
			var attributes = processData(response);
			createPoints(response, map, attributes);
		}
    });
};

function createPoints(data,map,attributes){
	featLayer = L.geoJson(data, {
                pointToLayer: function (feature, latlng){
                    //return L.circleMarker(latlng, geojsonMarkerOptions);
					return pointToLayer(feature,latlng,attributes);
                }
			}).addTo(map);
};

function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("2") > -1){
            attributes.push(attribute);
        };
    };

    return attributes;
};

//create function to make the proportional symbols of a certain color, fill, opacity, etc
function pointToLayer(feature, latlng, attributes){
	
	var attribute = attributes[0];
	
	//create marker options
	var geojsonMarkerOptions = {
		radius: 4,
		fillColor: "#4D59F7",
		color: "#EFEFEF",
		weight: 1,
		opacity: 0.8,
		fillOpacity: 0.8
	};
	
	var layer = L.circleMarker(latlng, geojsonMarkerOptions);
	
	//build popup content string starting with city...Example 2.1 line 24
	var popupContent = "<p><b>School Name:</b> " + feature.properties.SCHOOL + "</p>";
	
	popupContent += "<p><b>District Name:</b> " + feature.properties.DISTRICT + "</p>";
    
    popupContent += "<p><b>Percentage of Students Meeting Minimum Vaccination Requirements:</b> At least " + feature.properties.PctMetMinRequirements_Vax + "%</p>"; 
		
	//bind the popup to the circle marker
    layer.bindPopup(popupContent, {
		offset: new L.point(0, -1)
	});
	
	return layer		
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
