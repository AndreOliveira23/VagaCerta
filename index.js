//Define a região inicial do mapa para SP, com nível de zoom 12 (numa escala de 0 a 18)
//Na escala, 0 é o mundo inteiro e 18 é o nível de rua
var map = L.map('map', {
  center: [-23.5489, -46.6388], 
  zoom: 12,
  zoomControl: false // Desativa o controle de zoom padrão
});


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


//Adiciona o controle de zoom personalizado
document.getElementById('botaoZoomIn').onclick = function(){
  map.zoomIn();
}

document.getElementById('botaoZoomOut').onclick = function(){
  map.zoomOut();
}

document.getElementById('botaoOcultarRota').onclick = function(){
  if(displayed){
    document.getElementsByClassName("leaflet-routing-container leaflet-bar leaflet-control")[i].style.display = "none";
    displayed = false;
    document.getElementById('rota').innerText = "Mostrar rota";
  }else{
    document.getElementsByClassName("leaflet-routing-container leaflet-bar leaflet-control")[i].style.display = "block";
    displayed = true;
    document.getElementById('rota').innerText = "Ocultar rota";
  }
}

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

document.getElementById('botaoOcultarRota').style.display = "none"; //Botão de mostrar/ocultar rota inicialmente oculto (só aparece após traçar a rota)

var i = 0; //Variável para controlar a contagem de rotas criadas, para removê-las.

function setRoute(){
  //Esconde o botão de mostrar/ocultar rota gerado pela rota anterior
  document.getElementById('botaoOcultarRota').style.display = "none";

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
      collapsible: true,
      lineOptions: { //Estilo da linha da rota
        styles: [{ color: 'blue', opacity: 1, weight: 5 }]
      }
    }).addTo(map);
  },200);

  //Mostra o botão de mostrar/ocultar rota depois de traçar a rota
  setTimeout(function(){
    document.getElementById('botaoOcultarRota').style.display = "block";
  },800);

  getParkingLotData();//Chama a função para buscar os estacionamentos ao redor da localização
}

var displayed = true;
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
      }); 
      markers.addLayer(geojsonLayer);
      map.addLayer(markers);
      // Adiciona um controle de camadas para os marcadores
      $('#mySpinner').removeClass('spinner');
  }, "xml"); //fecha $.get
}

//Funções auxiliares
function abrirSidebar(){
  event.stopImmediatePropagation();//Impede que o evento de clique se propague para o mapa
  document.querySelector('#dialog').show();
}

function fecharSidebar(){
  document.querySelector('#dialog').close();
}

function abrirTermosDeUso(){
  document.querySelector('#modal2').show();
}

function fecharTermosDeUso(){
  document.querySelector('#modal2').close();
}

function fecharModalEstacionamento(){
  document.querySelector('#modal').close();
}

document.getElementById('data').onclick = function(){
  document.getElementById('data').innerHTML = "<i>today</i>26/11/2024";
}

document.getElementById('hora').onclick = function(){
  document.getElementById('hora').innerHTML = "<i>schedule</i>19h30";
}


//Preenche o modal dinâmicamente com as informações do estacionamento ao clicar no marcador
markers.on('click', function() {
  var index =  Math.floor(Math.random() * 51); // Make sure to assign this index in your feature properties

  var estacionamentos = generateEstacionamentos();
  let estacionamento = estacionamentos[index];

  document.getElementById('nome-do-estacionamento').innerText = estacionamento.nome;
  document.getElementById('endereco-do-estacionamento').innerText = estacionamento.endereco;
  var porcentagem = estacionamento.lotacao / estacionamento.capacidade * 100;
  document.getElementById('porcentagem-ocupacao').innerText = Math.round(porcentagem) + '% ocupado';

  let starRating = '';
  for (let i = 0; i < 5; i++) {
    if (i < estacionamento.avaliacao) {
      starRating += '<span class="fa fa-star checked" style="font-size: 60px"></span>'; // Estrela preenchida
    } else {
      starRating += '<span class="fa fa-star" style="font-size: 60px"></span>'; // Estrela vazia
    }
  }
  document.getElementById('nota-do-estacionamento').innerHTML = starRating;
  document.querySelector('#modal').show();
});

/**********************************************MOCKS DE INFO DOS ESTACIONAMENTOS**********************************************************/
function generateEstacionamentos() {
  return [
    {nome: "Estacionamento 1", endereco: "Rua 1, 123, Bairro 1, Cidade 1", lotacao: 10, capacidade: 200, avaliacao: 5},
    {nome: "Estacionamento 2", endereco: "Rua 2, 456, Bairro 2, Cidade 2", lotacao: 15, capacidade: 240, avaliacao: 3},
    {nome: "Estacionamento 3", endereco: "Rua 3, 789, Bairro 3, Cidade 3", lotacao: 18, capacidade: 100, avaliacao: 4},
    {nome: "Estacionamento 4", endereco: "Rua 4, 1011, Bairro 4, Cidade 4", lotacao: 20, capacidade: 80, avaliacao: 4},
    {nome: "Estacionamento 5", endereco: "Rua 5, 1213, Bairro 5, Cidade 5", lotacao: 25, capacidade: 50, avaliacao: 5},
    {nome: "Estacionamento 6", endereco: "Rua 6, 1415, Bairro 6, Cidade 6", lotacao: 12, capacidade: 50, avaliacao: 3},
    {nome: "Estacionamento 7", endereco: "Rua 7, 1617, Bairro 7, Cidade 7", lotacao: 20, capacidade: 20, avaliacao: 4},
    {nome: "Estacionamento 8", endereco: "Rua 8, 1819, Bairro 8, Cidade 8", lotacao: 220, capacidade: 300, avaliacao: 5},
    {nome: "Estacionamento 9", endereco: "Rua 9, 2021, Bairro 9, Cidade 9", lotacao: 220, capacidade: 250, avaliacao: 4},
    {nome: "Estacionamento 10", endereco: "Rua 10, 2223, Bairro 10, Cidade 10", lotacao: 120, capacidade: 120, avaliacao: 3},
    {nome: "Estacionamento 11", endereco: "Rua 11, 2324, Bairro 11, Cidade 11", lotacao: 50, capacidade: 200, avaliacao: 4},
    {nome: "Estacionamento 12", endereco: "Rua 12, 2526, Bairro 12, Cidade 12", lotacao: 30, capacidade: 100, avaliacao: 3},
    {nome: "Estacionamento 13", endereco: "Rua 13, 2728, Bairro 13, Cidade 13", lotacao: 10, capacidade: 90, avaliacao: 5},
    {nome: "Estacionamento 14", endereco: "Rua 14, 2930, Bairro 14, Cidade 14", lotacao: 75, capacidade: 150, avaliacao: 4},
    {nome: "Estacionamento 15", endereco: "Rua 15, 3132, Bairro 15, Cidade 15", lotacao: 60, capacidade: 200, avaliacao: 5},
    {nome: "Estacionamento 16", endereco: "Rua 16, 3334, Bairro 16, Cidade 16", lotacao: 20, capacidade: 80, avaliacao: 3},
    {nome: "Estacionamento 17", endereco: "Rua 17, 3536, Bairro 17, Cidade 17", lotacao: 100, capacidade: 100, avaliacao: 4},
    {nome: "Estacionamento 18", endereco: "Rua 18, 3738, Bairro 18, Cidade 18", lotacao: 40, capacidade: 50, avaliacao: 3},
    {nome: "Estacionamento 19", endereco: "Rua 19, 3940, Bairro 19, Cidade 19", lotacao: 15, capacidade: 70, avaliacao: 4},
    {nome: "Estacionamento 20", endereco: "Rua 20, 4142, Bairro 20, Cidade 20", lotacao: 55, capacidade: 110, avaliacao: 5},
    {nome: "Estacionamento 21", endereco: "Rua 21, 4344, Bairro 21, Cidade 21", lotacao: 90, capacidade: 150, avaliacao: 4},
    {nome: "Estacionamento 22", endereco: "Rua 22, 4546, Bairro 22, Cidade 22", lotacao: 10, capacidade: 200, avaliacao: 3},
    {nome: "Estacionamento 23", endereco: "Rua 23, 4748, Bairro 23, Cidade 23", lotacao: 25, capacidade: 120, avaliacao: 4},
    {nome: "Estacionamento 24", endereco: "Rua 24, 4950, Bairro 24, Cidade 24", lotacao: 70, capacidade: 90, avaliacao: 5},
    {nome: "Estacionamento 25", endereco: "Rua 25, 5152, Bairro 25, Cidade 25", lotacao: 35, capacidade: 110, avaliacao: 4},
    {nome: "Estacionamento 26", endereco: "Rua 26, 5354, Bairro 26, Cidade 26", lotacao: 30, capacidade: 60, avaliacao: 3},
    {nome: "Estacionamento 27", endereco: "Rua 27, 5556, Bairro 27, Cidade 27", lotacao: 60, capacidade: 90, avaliacao: 4},
    {nome: "Estacionamento 28", endereco: "Rua 28, 5758, Bairro 28, Cidade 28", lotacao: 85, capacidade: 100, avaliacao: 5},
    {nome: "Estacionamento 29", endereco: "Rua 29, 5960, Bairro 29, Cidade 29", lotacao: 20, capacidade: 50, avaliacao: 3},
    {nome: "Estacionamento 30", endereco: "Rua 30, 6162, Bairro 30, Cidade 30", lotacao: 90, capacidade: 200, avaliacao: 4},
    {nome: "Estacionamento 31", endereco: "Rua 31, 6364, Bairro 31, Cidade 31", lotacao: 40, capacidade: 80, avaliacao: 3},
    {nome: "Estacionamento 32", endereco: "Rua 32, 6566, Bairro 32, Cidade 32", lotacao: 60, capacidade: 150, avaliacao: 5},
    {nome: "Estacionamento 33", endereco: "Rua 33, 6768, Bairro 33, Cidade 33", lotacao: 20, capacidade: 120, avaliacao: 3},
    {nome: "Estacionamento 34", endereco: "Rua 34, 6970, Bairro 34, Cidade 34", lotacao: 100, capacidade: 200, avaliacao: 5},
    {nome: "Estacionamento 35", endereco: "Rua 35, 7172, Bairro 35, Cidade 35", lotacao: 15, capacidade: 80, avaliacao: 3},
    {nome: "Estacionamento 36", endereco: "Rua 36, 7374, Bairro 36, Cidade 36", lotacao: 110, capacidade: 150, avaliacao: 4},
    {nome: "Estacionamento 37", endereco: "Rua 37, 7576, Bairro 37, Cidade 37", lotacao: 30, capacidade: 90, avaliacao: 3},
    {nome: "Estacionamento 38", endereco: "Rua 38, 7778, Bairro 38, Cidade 38", lotacao: 20, capacidade: 40, avaliacao: 4},
    {nome: "Estacionamento 39", endereco: "Rua 39, 7980, Bairro 39, Cidade 39", lotacao: 50, capacidade: 100, avaliacao: 5},
    {nome: "Estacionamento 40", endereco: "Rua 40, 8182, Bairro 40, Cidade 40", lotacao: 120, capacidade: 250, avaliacao: 5},
    {nome: "Estacionamento 41", endereco: "Rua 41, 8384, Bairro 41, Cidade 41", lotacao: 60, capacidade: 120, avaliacao: 3},
    {nome: "Estacionamento 42", endereco: "Rua 42, 8586, Bairro 42, Cidade 42", lotacao: 90, capacidade: 140, avaliacao: 4},
    {nome: "Estacionamento 43", endereco: "Rua 43, 8788, Bairro 43, Cidade 43", lotacao: 75, capacidade: 100, avaliacao: 4},
    {nome: "Estacionamento 44", endereco: "Rua 44, 8990, Bairro 44, Cidade 44", lotacao: 50, capacidade: 70, avaliacao: 3},
    {nome: "Estacionamento 45", endereco: "Rua 45, 9192, Bairro 45, Cidade 45", lotacao: 15, capacidade: 30, avaliacao: 5},
    {nome: "Estacionamento 46", endereco: "Rua 46, 9394, Bairro 46, Cidade 46", lotacao: 80, capacidade: 90, avaliacao: 4},
    {nome: "Estacionamento 47", endereco: "Rua 47, 9596, Bairro 47, Cidade 47", lotacao: 25, capacidade: 70, avaliacao: 3},
    {nome: "Estacionamento 48", endereco: "Rua 48, 9798, Bairro 48, Cidade 48", lotacao: 60, capacidade: 110, avaliacao: 5},
    {nome: "Estacionamento 49", endereco: "Rua 49, 9999, Bairro 49, Cidade 49", lotacao: 30, capacidade: 90, avaliacao: 4},
    {nome: "Estacionamento 50", endereco: "Rua 50, 10000, Bairro 50, Cidade 50", lotacao: 100, capacidade: 150, avaliacao: 5}
  ];
}