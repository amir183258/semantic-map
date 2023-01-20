const map = new ol.Map({
    target: "map"
});

const view = new ol.View({
    //center: ol.proj.fromLonLat([51.6, 32.6]),
    center: [(-13884991 - 7455066) / 2, (6338219 + 2870341) / 2],
    zoom: 3
});
map.setView(view);

// OSM layer
const osm = new ol.layer.Tile({
    source: new ol.source.OSM
});
map.addLayer(osm);

// USA states layer
const statesUSASource = new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/wms",
    params: {'LAYERS': 'topp:states', 'TILED': true},
    serverType: 'geoserver',
    transition: 0,
});

const statesUSA = new ol.layer.Tile({
    extent: [-13884991, 2870341, -7455066, 6338219],
    source: statesUSASource
});
map.addLayer(statesUSA);

// Iran states layer
const iranStatesSource = new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/wms",
    params: {'LAYERS': 'nyc:States', 'TILED': true},
    serverType: 'geoserver',
    transition: 0,
});

const iranStates = new ol.layer.Tile({
    source: iranStatesSource 
});
map.addLayer(iranStates);

// Event handler
map.on("click", function (evt) {
    const coordinates = ol.proj.toLonLat(evt.coordinate);
    addMarker(coordinates);
    revserseGeocode(coordinates);
});

// Marker definition
var vectorSource = new ol.source.Vector({});

var dinamicPinLayer = new ol.layer.Vector({
    source: vectorSource,
});

map.addLayer(dinamicPinLayer);

// Reverse geocode function
function revserseGeocode(coordiantes) {
    request = "https://api.tomtom.com/search/2/reverseGeocode/" + String(coordiantes[1]) + "," + String(coordiantes[0]);
    request += ".json?key=GmFrBSBi8VLDhqSbiGGT9KiugElcmPQQ&radius=100";

    fetch(request)
    .then((response) => response.json())
    .then((data) => {
        const addressBox = document.getElementById("address");

        addressBox.style.display = "flex";
        addressBox.style.alignItems= "center";
        addressBox.style.justifyContent= "center";
        addressBox.style.fontSize = "20px";
        
        addressBox.innerHTML = data.addresses[0].address.freeformAddress;
  });
}

// Get feature information
map.on("click", function (evt) {
    var viewResolution = /** @type {number} */ (view.getResolution());
    console.log(viewResolution);
        var url = iranStatesSource.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, 'EPSG:3857',
            {'INFO_FORMAT': 'application/json'});
    console.log(url);

    result = document.getElementById("identify");

    const headings = ["State", "Area", "Population"];

    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        if (data.features.length > 0) {
            const values = [data.features[0].properties.SOURCETHM,
                            data.features[0].properties.AREA,
                            data.features[0].properties.Population
            ];

            result.innerHTML = "<tr><th>" + headings[0] + "</th><th>" +
                headings[1] + "</th><th>" + headings[2] + "</th></tr>" + 
                "<tr><td>" + values[0] + "</td><td>" + values[1] + "</td><td>" + values[2] +
                "</td>";
        }
        else {
            result.style.border = "none";
            result.innerHTML = "No Data";
        }

    });


});