
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {
    });
  });
            
  /* Get coordinates after clicking on the map */

  // config map
  let config = {
    minZoom: 0,
    maxZoom: 18,
  };
  // magnification with which the map will start
  const zoom = 18;
  // co-ordinates
  const lat = -23.5489;
  const lng = -46.6388;
  
  // calling map
  const map = L.map("map", config).setView([lat, lng], zoom);
  
  // Used to load and display tile layers on the map
  // Most tile servers require attribution, which you can set under `Layer`
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  
 
  // Add click event listeners to the markers
  L.marker([-23.549303528562227, -46.639324444983856])
      .addTo(map)
      .on('click', function() {
          var modalInstance = M.Modal.getInstance(document.getElementById('modal1'));
          modalInstance.open();
      })
      .bindPopup('Estacionamento 1');
  
  L.marker([-23.548698207032892, -46.64079405570502])
      .addTo(map)
      .bindPopup('Center Warsaw');
  
  L.marker([-23.5494511675368, -46.64063851296448])
      .addTo(map)
      .bindPopup('Center Warsaw');


  
  function teste(){
       var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {
      // specify options here
    });
  }
  
  // obtaining coordinates after clicking on the map
  map.on('click', function(ev){
    var latlng = map.mouseEventToLatLng(ev.originalEvent);
    console.log(latlng.lat + ', ' + latlng.lng);
    
    L.marker([latlng.lat, latlng.lng]).addTo(map).on('click', function() {
        var modalInstance = M.Modal.getInstance(document.getElementById('modal1'));
        modalInstance.open();
    }).bindPopup("Center Warsaw");
  
  });

// Function to capture map click events and place a new marker
map.on('click', function (ev) {
    var latlng = map.mouseEventToLatLng(ev.originalEvent);
    console.log(latlng.lat + ', ' + latlng.lng);

    L.marker([latlng.lat, latlng.lng]).addTo(map).bindPopup("Center Warsaw");
});


//barra de pesquisa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  var searchControl = L.esri.Geocoding.geosearch().addTo(map);
  
  var results = L.layerGroup().addTo(map);
  
  searchControl.on('results', function(data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
      results.addLayer(L.marker(data.results[i].latlng));
    }
  });