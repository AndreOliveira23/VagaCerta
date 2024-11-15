//Define a região inicial do mapa para SP, com nível de zoom 12 (numa escala de 0 a 18)
//Na escala, 0 é o mundo inteiro e 18 é o nível de rua
var map = L.map('map').setView([-23.5489,-46.6388], 12);


//Mostra o mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


//Adiciona o ícone de menu
var menuIcon = L.control({position: 'topleft'});

menuIcon.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'menu-icon');
  div.innerHTML = '<button class="circle transparent" onclick="abrirSidebar()">\
                        <i id="menu-icon-mapa">menu</i>\
                   </button>';
  return div;
};

menuIcon.addTo(map);


function abrirSidebar(){
    event.stopImmediatePropagation();
    document.querySelector('#dialog').show();
}
  
function fecharSidebar(){
    document.querySelector('#dialog').close();
}

map.on('click', function(ev) {
    var latlng = map.mouseEventToLatLng(ev.originalEvent);
    console.log(latlng.lat + ', ' + latlng.lng);
});

//Barra de pesquisa (API do Leaflet)
const searchControl = new GeoSearch.GeoSearchControl({
  provider: new GeoSearch.OpenStreetMapProvider(),
  style: 'bar',
});
map.addControl(searchControl);

/*Pega a string da barra de pesquisa estilizada e envia para a
barra de pesquisa do leaflet, após apertar "enter" */
const textbox = document.getElementById("search");
const searchInput = document.getElementById("search");

textbox.addEventListener("keypress", function onEvent(event) {
    if (event.key === "Enter") {
      console.log("Entered value:", searchInput.value);
      document.querySelector('.glass').value = searchInput.value;
      clicar();
    }
});

/*Após passar a string pra barra de pesquisa, simula o clique de um enter para efetivamente buscar
a localização inserida */
function clicar(){
    
// Cria um evento para o clique de um enter
  const event = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    which: 13,
    keyCode: 13,
  });

  //Ativa o evento de clique de um enter na barra de pesquisa da API quando houver um clique de enter na barra estilizada
  const elements = document.getElementsByClassName('glass'); // glass é a classe do input da barra de pesquisa do leaflet
    if (elements.length > 0) {
      elements[0].dispatchEvent(event); // Simula o enter na barra de pesquisa do leaflet para pesquisar a localização
      //Chama a função para definir a rota depois de 2 segundos
      setTimeout(setRoute, 2000);
    }
}

var destino;

// Armazena as coordenadas do destino depois de encontrá-lo
map.on('locationfound', function (e) {
  var lat = result.latitude; // Latitude
  var lng = result.longitude; // Longitude
  destino = { lat: lat, lng: lgn};
  console.log("Found location coordinates:", lat, lng);
});


var userLocation; // Variável global para armazenar a localização do usuário


//Descobrindo a localização atual do usuário
navigator.geolocation.getCurrentPosition(function(position) {
  userLocation = L.latLng(position.coords.latitude, position.coords.longitude);

  map.setView(userLocation, 15);

  // Adiciona um marcador na localização do usuário
  L.marker(userLocation).addTo(map).bindPopup("Você está aqui!!").openPopup();


}, function(error) {
  console.error("Falha na geolocalização: " + error.message);
  alert("Não foi possível determinar a sua localização. Veja se o GPS está habilitado.");
});


i = 0; //Variável para controlar a contagem de rotas criadas, para removê-las.

function setRoute(){

  /*Removendo marcador antigo, colocado sobre o destino encontrado, para não sobrepor o novo marcador
  que será colocado no destino da rota*/

  map.eachLayer((layer) => {
    
    //Polyline é a linha que representa a rota, LayerGroup é o grupo de camadas e Marker é o marcador
    if (layer instanceof L.Polyline || layer instanceof L.LayerGroup || layer instanceof L.Marker) { 
        layer.remove();
    }
  });


  //Remove a barra de rotas anterior
    setTimeout(function(){
        document.getElementsByClassName("leaflet-routing-container leaflet-bar leaflet-control")[i].style.display = "none";
        i++;
    }, 50);

    //Cria a nova rota
    setTimeout(function(){
        var destino = map.getCenter();
        L.Routing.control({
            waypoints: [
                userLocation,
                destino
            ],
            lineOptions: { //Estilo da linha da rota
              styles: [{ color: 'blue', opacity: 1, weight: 5 }] 
          }
        }).addTo(map);
    },200);

    getParkingLotData();
}



var markers = new L.FeatureGroup();
/*Chama a função para localizar os estacionamentos ao redor da localização
Está desta forma porque várias funções são chamadas ao apertar o 'enter' após digitar o endereço:
cliclar(), setRoute() e getParkingLotData(). clicar() é chamada primeiro pois
é a função que faz a busca pelo endereço digitado. setRoute() é chamada
em seguida para traçar a rota entre os pontos de origem e destino. Existe um delay
associado a setRoute() para garantir que a rota seja traçada após a remoção da rota anterior.
Por fim, getParkingLotData() é chamada para buscar os estacionamentos ao redor da localização encontrada.
Todos esses delays podem ser ajustados para melhorar a experiência do usuário. */

function getParkingLotData() {
  setTimeout(function() {
    getData();
  }, 900);
};


function getData() {
  // Remove os marcadores antigos (tirar isso faz com que as instruções da rota fiquem sobre a tela)
  markers.clearLayers();
  var bbox = map.getBounds();
  console.log(bbox);
  
  // Define a área de busca para os estacionamentos
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
          '(' + 
          'node["amenity"="parking"](' + overpassQueryBox + ');' +
          'way["amenity"="parking"](' + overpassQueryBox + ');' +
          'relation["amenity"="parking"](' + overpassQueryBox + ');' +
          ');' +
          'out%20center;';
      console.log(query);
      return query;
  }

  $.get(overpassQuery, function(data) {
      var data = osmtogeojson(data);
      var geojsonLayer = L.geoJson(data, {
          pointToLayer: function(feature, latlng) {
              var MarkerOptions = L.icon({
                  iconUrl: 'map-marker-svgrepo-com.svg',
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
          } //fecha onEachFeature
      }); // fecha L.geojson
      markers.addLayer(geojsonLayer);
      map.addLayer(markers);
      // Adiciona um controle de camadas para os marcadores
      $('#mySpinner').removeClass('spinner');
  }, "xml"); //fecha $.get
}