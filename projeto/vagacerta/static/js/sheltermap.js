/*
This file is part of sheltermap.

Sheltermap is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Sheltermap is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with sheltermap.  If not, see <https://www.gnu.org/licenses/>.
*/

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    alert("This map is not suitable for use on mobile devices. Please download OsmAnd instead. It enables adding notes, searching for shelters, seeing pictures linked from OSM objects and editing the map directly.");
}

var markers = new L.FeatureGroup();

$('#load').click(function() { init2() });

function init2() {
    var zoom = map.getZoom();
    console.info(zoom);
    var zoomlimit = 9;
    if (zoom <= zoomlimit)
        alert("On zoom level:" + zoom + ". Please zoom in to at least level " + (zoomlimit + 1) + " or higher");
    else {
        // $('.spinner').fadeIn();
        $('#mySpinner').addClass('spinner');
        getData();
    }
};

function getData() {
    // Clear markers before getting new ones
    markers.clearLayers();

    var bbox = map.getBounds();
    console.log(bbox);
    // Order to fit Overpass bbox
    var overpassQueryBox = [
        bbox._southWest.lat,
        bbox._southWest.lng,
        bbox._northEast.lat,
        bbox._northEast.lng
    ];
    var overpassQuery = buildQuery(overpassQueryBox);

    function buildQuery(overpassQueryBox) {
        var query =
            'https://overpass-api.de/api/interpreter?' +
            'data=[out:xml][timeout:25];' +
            '(' +  // Start union
            // Get parking lots
            'node["amenity"="parking"](' + overpassQueryBox + ');' +
            'way["amenity"="parking"](' + overpassQueryBox + ');' +
            'relation["amenity"="parking"](' + overpassQueryBox + ');' +
            ');' +  // End union
            'out%20center;';
        console.log(query);
        return query;
    }

    $.get(overpassQuery, function(data) {
        //console.info(data);
        var data = osmtogeojson(data);
        //console.info(data);
        var geojsonLayer = L.geoJson(data, {
            pointToLayer: function(feature, latlng) {
                var MarkerOptions = L.icon({
                    iconUrl: '/static/images/red.svg',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                    popupAnchor: [0, -15]
                });
                return L.marker(latlng, { icon: MarkerOptions });
            },
            onEachFeature: function(feature, layer) {
                var popupOptions = { maxWidth: 320, minWidth: 250, maxHeight: 350, autoPan: true, closeButton: true };
                var desc_head = "<b>Description:</b> ";
                var desc = feature.properties.description || desc_head + "None yet";
                var popupContent = '<h1>' + (feature.properties.name || "") + '</h1>' +
                    '<div>' + desc + '</div>' +
                    '<h3>Tags</h3>' +
                    '<div>' + Object.entries(feature.properties).map(([key, value]) => `<b>${key}:</b> ${value}`).join("<br />") + '</div>';
                layer.bindPopup(popupContent, popupOptions);
            } //close onEachFeature
        }); // close L.geojson

        markers.addLayer(geojsonLayer);
        map.addLayer(markers);

        //fade out the loading spinner
        // $('.spinner').fadeOut();
        $('#mySpinner').removeClass('spinner');
    }, "xml");
} // End of getData()
