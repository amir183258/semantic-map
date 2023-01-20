const map = new ol.Map({
    target: "map"
});

const view = new ol.View({
    center: ol.proj.fromLonLat([51.6, 32.6]),
    zoom: 10
});
map.setView(view);

const osm = new ol.layer.Tile({
    source: new ol.source.OSM
});
map.addLayer(osm);

map.on("click", function (evt) {
    const coordinates = ol.proj.toLonLat(evt.coordinate);
    addMarker(coordinates);
    revserseGeocode(coordinates);
});

var vectorSource = new ol.source.Vector({});

var dinamicPinLayer = new ol.layer.Vector({
    source: vectorSource,
});

map.addLayer(dinamicPinLayer);

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
  })
}