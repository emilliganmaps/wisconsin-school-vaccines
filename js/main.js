$(document).click(function(){
    $("#welcomeWrapper").hide();
});

var schools;

//function to retrieve the data and place it on the map
function getData(map){
    //load the data from the pertussis json
    $.ajax("data/WI_PubSchools_VaxData.geojson", {
        dataType: "json",
        success: function(response){
			var attributes = processData(response);
            createPoints(response, map, attributes);
            otherLayers(response, map, attributes);
		}
    });
};

function createPoints(data,map,attributes){
	schools = L.geoJson(data, {
                pointToLayer: function (feature, latlng){
					return pointToLayer(feature, latlng, attributes);
                }
			});
	map.addLayer(schools);
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
	var schoolsMarker = {
		radius: 4,
		fillColor: "#4D59F7",
		color: "#EFEFEF",
		weight: 1,
		opacity: 0.8,
		fillOpacity: 0.8,
        zIndex: 600
	};
	
	var layer = L.circleMarker(latlng, schoolsMarker);
	
	//build popup content string starting with city...Example 2.1 line 24
	var popupContent = "<p><b>School Name:</b> " + feature.properties.SCHOOL + "</p>";
	
	popupContent += "<p><b>District Name:</b> " + feature.properties.DISTRICT + "</p>";
    
	if (feature.properties.PctMetMinRequirements_Vax > 0) {
		popupContent += "<p><b>Percentage of students meeting minimum vaccination requirements:</b> At least " + feature.properties.PctMetMinRequirements_Vax + "%</p>"; 
	}
    
    else {
		popupContent += "<p><b>Percentage of students meeting minimum vaccination requirements:</b> <i> No data available</i></p>";
	};
	
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
        fillColor: "#94F921",
        opacity: 0.5,
        weight: 0.5,
        color: "black",
        fillOpacity: 0.4,
        zIndex: 400
    };
};


//style districts layer
function styleDistricts(feature){
    return {
        fillColor: "#21F2F9",
        opacity: 0.5,
        weight: 0.5,
        color: "black",
        fillOpacity: 0.4,
        zIndex: 400
    };
};


function createMap(){
    //create map object
    var map = L.map("map", {
        center: [44.7844, -89.7879],
        zoom: 7,
        minZoom: 3,
        maxZoom: 12
    });
    
	getData(map);
};


function otherLayers(response, map, attributes){ 
    //add base tile layer
    var light = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZW1pbGxpZ2FuIiwiYSI6ImNqczg0NWlxZTBia2U0NG1renZyZDR5YnUifQ.UxV3OqOsN6KuZsclo96yvQ', {
        //map attribution
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
        //zoom
        maxZoom: 18,
        //mapbox light
        id: 'mapbox.light',
        //my unique access token
        accessToken: 'pk.eyJ1IjoiZW1pbGxpZ2FuIiwiYSI6ImNqczg0NWlxZTBia2U0NG1renZyZDR5YnUifQ.UxV3OqOsN6KuZsclo96yvQ'
    }),
        streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZW1pbGxpZ2FuIiwiYSI6ImNqczg0NWlxZTBia2U0NG1renZyZDR5YnUifQ.UxV3OqOsN6KuZsclo96yvQ', {
        //map attribution
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
        //zoom
        maxZoom: 18,
        //mapbox streets
        id: 'mapbox.streets',
        //my unique access token
        accessToken: 'pk.eyJ1IjoiZW1pbGxpZ2FuIiwiYSI6ImNqczg0NWlxZTBia2U0NG1renZyZDR5YnUifQ.UxV3OqOsN6KuZsclo96yvQ'
    }).addTo(map);
    
    
    var counties = new L.geoJSON(Counties, {style:styleCounties}).addTo(map);
    var districts = new L.geoJSON(Districts, {style:styleDistricts}).addTo(map);
    
    
    //add basemaps
    var baseMaps = {
        "Greyscale": light,
        "Streets": streets,
    };
    
    
    //add new data layer
    var overlayMaps = {
        "Unified School Districts": districts,
        "Counties": counties
    };
    
	
    //layer control
    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);
    schools.bringToFront();
    
    map.on("overlayadd", function (event) {
    schools.bringToFront();
    });
    
	//console.log(schools);
    
    //search for a school
    var searchControl = new L.Control.Search({
        position: 'topright', //position on page
        layer: schools,
		propertyName: 'SCHOOL', //school column
        circleLocation: true,
        textPlaceholder: 'Search School Name', //search by name of school
        collapsed: false,
		moveToLocation: function(latlng, title, map) {
			console.log(latlng);
			//map.fitBounds( latlng.layer.getBounds() );
			//var zoom = map.getBoundsZoom(latlng.layer.getBounds());
			zoom = 10;
  			map.setView(latlng, zoom); // access the zoom
		}
    });
    
	searchControl.on('search:locationfound', function(e) {

    //style the search result
	e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
	if(e.layer._popup)
		e.layer.openPopup();
	});
	
    //initialize search control
    map.addControl(searchControl);
    
    
    var range = document.getElementById('range');

    noUiSlider.create(range, {
        start: [ 50, 80 ], // Handle start position
        step: 5, // Slider moves in increments of '10'
        margin: 10, // Handles must be more than '10' apart
        connect: true, // Display a colored bar between the handles
        direction: 'rtl', // Put '0' at the bottom of the slider
        orientation: 'vertical', // Orient the slider vertically
        behaviour: 'tap-drag', // Move handle on tap, bar is draggable
        range: { // Slider can select '0' to '100'
            'min': 30,
            'max': 100
        },
        tooltips: true,
        format: wNumb({
                decimals: 0,
                suffix: '% vaccinated'
        })
    });
    
    document.getElementById('input-number-min').setAttribute("value", 30);
    document.getElementById('input-number-max').setAttribute("value", 100);

    var inputNumberMin = document.getElementById('input-number-min'),
        inputNumberMax = document.getElementById('input-number-max');
    
    // When the input changes, set the slider value
    inputNumberMin.addEventListener('change', function(){
        range.noUiSlider.set([this.value, null]);
    });
    
    // When the input changes, set the slider value
    inputNumberMax.addEventListener('change', function(){
        range.noUiSlider.set([null, this.value]);
    });
    
    range.noUiSlider.on('update', function( values, handle ) {

        if (handle==0){
            document.getElementById('input-number-min').value = values[0];
        } else {
            document.getElementById('input-number-max').value =  values[1];
        }
        
        rangeMin = document.getElementById('input-number-min').value;
        rangeMax = document.getElementById('input-number-max').value;
        
        //clear the layer:
        schools.removeLayer(schools);
        
        //and repopulate it
        schools = new L.geoJson(schools,{
            onEachFeature: pointToLayer,
            filter:
                function(feature, layer) {
                     return (feature.properties.PctMetMinRequirements_Vax <= rangeMax) && (feature.properties.PctMetMinRequirements_Vax >= rangeMin);
                },
            pointToLayer: schoolsMarker
        })
        
    });
    
    
	return map;
};


$(document).ready(createMap);