var earthquake_queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquake_queryUrl, function(data){
  console.log(data);
  createFeatures(data.features);
});

function markerSize(magnitude) {
  return magnitude * 5;
};

function Color(magnitude){
  return magnitude > 5 ? "#dc143c":
  magnitude  > 4 ? "#ffa07a":
  magnitude > 3 ? "#ffd700":
  magnitude > 2 ? "#daa520":
  magnitude > 1 ? "#f0e68c":
           "#adff2f";
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function pointToLayer(geoJsonPoint,latlng){
    return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
  }

  function style(geoJsonFeature) {
    return {
        fillColor: Color(geoJsonFeature.properties.mag),
        fillOpacity: 1,
        weight: 0.5,
        color: 'black'
      }
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
    style: style
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Define streetmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
      "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

  // Create a legend to display information about our map
var info = L.control({ position: "bottomright" });

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+']
  var colors = [ "#adff2f", "#f0e68c", "#daa520", "#ffd700", "#ffa07a", "#dc143c" ]
  var div = L.DomUtil.create("div", "legend");

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML +=
        '<i style="background:' + colors[i] + '">&nbsp&nbsp&nbsp&nbsp</i> ' + labels[i] + '<br>';
    }
  return div;
};
// Add the info legend to the map
info.addTo(myMap);
}
