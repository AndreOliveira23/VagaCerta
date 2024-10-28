//Define a região inicial do mapa para SP, com nível de zoom 12 (numa escala de 0 a 18)
//Na escala, 0 é o mundo inteiro e 18 é o nível de rua
var map = L.map('map').setView([-23.5489,-46.6388], 12);

//Mostra o mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


//Barra de Pesquisa (Da API do Leaflet)

/*
var searchControl = L.esri.Geocoding.geosearch().addTo(map);
map.addControl(L.control.search());

document.querySelector('.leaflet-control-search').style.display = 'none';
*/


//Cria marcadores após clicar no mapa

let markerCount = 0; // Contador de marcadores, para gerar modais dinamicamente

map.on('click', function(ev) {
  var latlng = map.mouseEventToLatLng(ev.originalEvent);
  console.log(latlng.lat + ', ' + latlng.lng);

  // Cria o marcador e define o índice
  var marker = L.marker([latlng.lat, latlng.lng]).addTo(map);
  markerCount++;

  marker.on('click', function() {
      // Prepara o modal
      var modalInstance = M.Modal.getInstance(document.getElementById('modal1'));
      
      // Usa o índice do marcador para obter o estacionamento correspondente
      var index = markerCount - 1;

      // Pega as informações do estacionamento e preenche o modal
      var estacionamento = estacionamentos[index];

      // Preenche o modal com as informações do estacionamento
      document.getElementById('modal-nome').textContent = estacionamento.nome;
      document.getElementById('modal-endereco').textContent = `Endereço: ${estacionamento.endereco}`;
      document.getElementById('modal-lotacao').textContent = `Lotação: ${estacionamento.lotacao} / ${estacionamento.capacidade} (${Math.round((estacionamento.lotacao / estacionamento.capacidade) * 100)}%)`;

      // Abre o modal
      modalInstance.open();
  });


});

//Abre o Modal ao clicar nos marcadores inseridos no mapa
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {});
  
  var estacionamento = estacionamentos[Math.floor(Math.random() * 10)];
  
  // Atualiza o conteúdo do modal
  document.getElementById('modal-nome').textContent = estacionamento.nome;
  document.getElementById('modal-endereco').textContent = `Endereço: ${estacionamento.endereco}`;
  document.getElementById('modal-lotacao').textContent = `Lotação: ${estacionamento.lotacao} / ${estacionamento.capacidade} (${Math.round((estacionamento.lotacao / estacionamento.capacidade) * 100)}%)`;

});


/*Acredito que elementos comuns do HTML não aparecem sobre o mapa, então é necessário adicionar eles como controles do Leaflet,
para que possam ser adicionados ao mapa através do método addTo(map)*/


//Adiciona o ícone de menu
var menuIcon = L.control({position: 'topleft'});

menuIcon.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'menu-icon');
  div.innerHTML = '<i class=\'bx bx-menu\' style=" background-color: white; font-size: 32px; border-radius: 2px" onclick="sidebar()"></i>';
  return div;
};

menuIcon.addTo(map);

//Adiciona sidebar
var sideBar = L.control({position: 'topleft'});

sideBar.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'sidebar');
  div.innerHTML = '\
    <div id="sidebar" >\
          <h3>Menu</h3>\
          <div class = "link-sidebar"><a href="#" class="w3-bar-item w3-button">Link 1</a></div>\
          <div class = "link-sidebar"><a href="#" class="w3-bar-item w3-button">Link 2</a></div>\
          <div class = "link-sidebar"><a href="#" class="w3-bar-item w3-button">Link 3</a></div>\
          <div class = "link-sidebar"><a href="#" class="w3-bar-item w3-button">Link 4</a></div>\
    </div>\
  ';
  return div;
};

sideBar.addTo(map);

//Mostra ou esconde a sidebar ao clicar no ícone de menu

function sidebar(){
event.stopPropagation();

  var sidebar = document.getElementById("sidebar");
      if (sidebar.style.display === "none" || sidebar.style.display === "") {
        sidebar.style.display = "block";
      } else {
        sidebar.style.display = "none";
      }
};


var userLocation; // Variável global para armazenar a localização do usuário

//Faz com que a busca seja feita ao apertar Enter na barra de pesquisa
function handleSearch() { 
  if(event.key === 'Enter') {
    var search = document.getElementById("search").value;
    var geocodeService = L.esri.Geocoding.geocodeService();

    geocodeService.geocode().text(search).run(function (error, results) {
      if (error) {
        console.log(error);
        alert("Não foi possível encontrar o local");
        return;
      }

      var destination = results.results[0].latlng; // Define as coordenadas com base no destino desejado

      // Center the map on the destination
      map.setView(destination, 18);

      // Traça uma rota entre a localização do usuário e o destino escolhido
      L.Routing.control({
        waypoints: [
          userLocation,   // Recebe a localização do usuário pela variável global
          destination     // Destino
        ],
        routeWhileDragging: true
      }).addTo(map);
    });
  }
}


//Pega a localização atual do usuário e coloca na variável global "User Location"
navigator.geolocation.getCurrentPosition(function(position) {
  userLocation = L.latLng(position.coords.latitude, position.coords.longitude);

  map.setView(userLocation, 15);

  // Adiciona um marcador na localização do usuário
  L.marker(userLocation).addTo(map).bindPopup("Você está aqui!!").openPopup();


}, function(error) {
  console.error("Geolocation failed: " + error.message);
  alert("Could not get your location. Please ensure location services are enabled.");
});

//Mockando 10 nomes e endereços de estacionamentos
var estacionamentos = [
  {nome: "Estacionamento 1", endereco: "Rua 1, 123, Bairro 1, Cidade 1", lotacao: 10, capacidade: 200},
  {nome: "Estacionamento 2", endereco: "Rua 2, 456, Bairro 2, Cidade 2", lotacao: 15, capacidade: 240},
  {nome: "Estacionamento 3", endereco: "Rua 3, 789, Bairro 3, Cidade 3", lotacao: 18, capacidade: 100},
  {nome: "Estacionamento 4", endereco: "Rua 4, 1011, Bairro 4, Cidade 4", lotacao: 20, capacidade: 80},
  {nome: "Estacionamento 5", endereco: "Rua 5, 1213, Bairro 5, Cidade 5", lotacao: 25, capacidade: 50},
  {nome: "Estacionamento 6", endereco: "Rua 6, 1415, Bairro 6, Cidade 6", lotacao: 12, capacidade: 50},
  {nome: "Estacionamento 7", endereco: "Rua 7, 1617, Bairro 7, Cidade 7", lotacao: 20, capacidade: 20},
  {nome: "Estacionamento 8", endereco: "Rua 8, 1819, Bairro 8, Cidade 8", lotacao: 220, capacidade: 300},
  {nome: "Estacionamento 9", endereco: "Rua 9, 2021, Bairro 9, Cidade 9", lotacao: 220, capacidade: 250},
  {nome: "Estacionamento 10", endereco: "Rua 10, 2223, Bairro 10, Cidade 10", lotacao: 120, capacidade: 120}
];


//Cria um marcador para cada estacionamento
var markers = new L.FeatureGroup();

/*Chama a função para localizar os estacionamentos ao redor da localização

Está desta forma porque duas funções são chamadas ao apertar o 'enter' após digitar o endereço:
handleSearch() e getParkingLotData(). HandleSearch() é chamada primeiro pois
é a função que faz a busca pelo endereço digitado. getParkingLotData() é chamada
em seguida para buscar os estacionamentos ao redor da localização encontrada.
Por isso a função getParkingLotData() tem um setTimeout de 100ms para garantir que
ela seja chamada após a handleSearch()*/

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
                  iconUrl: 'red.svg',
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
  }, "xml");
}
