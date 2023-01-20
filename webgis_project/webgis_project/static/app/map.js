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
});

var vectorSource = new ol.source.Vector({});

var dinamicPinLayer = new ol.layer.Vector({
    source: vectorSource,
});

map.addLayer(dinamicPinLayer);