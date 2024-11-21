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
  div.innerHTML = '<button class="circle transparent" data-ui="#modal"  onclick="abrirSidebar()">\
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
                  iconUrl: '/projeto/vagacerta/static/images/map-marker-svgrepo-com.svg',
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

function localizar(){
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
              const { latitude, longitude } = position.coords;
              map.setView([latitude, longitude], 18);
              L.marker([latitude, longitude])
                  .addTo(map)
                  .bindPopup("Você está aqui!")
                  .openPopup();
          },
          () => {
              alert("Não foi possível buscar a sua localização. Verifique se o GPS está habilitado.");
          },
      );
  } else {
      alert("Geolocation is not supported by your browser.");
  }
}


//Preenche o modal dinâmicamente com as informações do estacionamento ao clicar no marcador
markers.on('click', function() {
  document.getElementById('data').innerHTML = "<i>today</i>Data";
  document.getElementById('hora').innerHTML = "<i>schedule</i>Hora";
  var index =  Math.floor(Math.random() * 51); // Make sure to assign this index in your feature properties

  var estacionamentos = generateEstacionamentos();
  let estacionamento = estacionamentos[index];

  document.getElementById('nome-do-estacionamento').innerText = estacionamento.nome;
  document.getElementById('endereco-do-estacionamento').innerHTML = '<b><i>map</i></b> '+estacionamento.endereco;
  var porcentagem = estacionamento.lotacao / estacionamento.capacidade * 100;
  document.getElementById('porcentagem-ocupacao').innerText = Math.round(porcentagem) + '% ocupado';

  let starRating = '';
  for (let i = 0; i < 5; i++) {
    if (i < estacionamento.avaliacao) {
      starRating += '<span class="fa fa-star checked" style="font-size: 24px"></span>'; // Estrela preenchida
    } else {
      starRating += '<span class="fa fa-star" style="font-size: 24px"></span>'; // Estrela vazia
    }
  }
  document.getElementById('nota-do-estacionamento').innerHTML = starRating;
  document.getElementById('preco-hora').innerText = 'R$ ' + estacionamento.preco_hora + ',00 / hora';
  document.getElementById('preco-total').innerText = 'Total: R$ ' + estacionamento.preco_hora +',00';
  document.querySelector('#modal').show();
});

/**********************************************MOCKS DE INFO DOS ESTACIONAMENTOS**********************************************************/
function generateEstacionamentos() {
  return [
    {nome: "Estacionamento Central", endereco: "Av. Paulista, 123", lotacao: 10, capacidade: 200, avaliacao: 5, preco_hora: 50},
    {nome: "Park Fácil", endereco: "Rua Haddock Lobo, 456", lotacao: 15, capacidade: 240, avaliacao: 3, preco_hora: 40},
    {nome: "Garage Bela Vista", endereco: "Rua Augusta, 789", lotacao: 18, capacidade: 100, avaliacao: 4, preco_hora: 35},
    {nome: "Estacionamento Premium", endereco: "Rua Oscar Freire, 1011", lotacao: 20, capacidade: 80, avaliacao: 4, preco_hora: 70},
    {nome: "Park Luxo", endereco: "Rua Estados Unidos, 1213", lotacao: 25, capacidade: 50, avaliacao: 5, preco_hora: 60},
    {nome: "Garage Express", endereco: "Rua Padre João Manoel, 1415", lotacao: 12, capacidade: 50, avaliacao: 3, preco_hora: 30},
    {nome: "Estacionamento Popular", endereco: "Rua da Consolação, 1617", lotacao: 20, capacidade: 20, avaliacao: 4, preco_hora: 20},
    {nome: "Park Avenida", endereco: "Av. Brigadeiro Faria Lima, 1819", lotacao: 220, capacidade: 300, avaliacao: 5, preco_hora: 55},
    {nome: "Central Paulista", endereco: "Rua Tabapuã, 2021", lotacao: 220, capacidade: 250, avaliacao: 4, preco_hora: 45},
    {nome: "Park Veloz", endereco: "Rua Clodomiro Amazonas, 2223", lotacao: 120, capacidade: 120, avaliacao: 3, preco_hora: 30},
    {nome: "Garage Norte", endereco: "Rua Voluntários da Pátria, 2324", lotacao: 50, capacidade: 200, avaliacao: 4, preco_hora: 40},
    {nome: "Estacionamento 24h", endereco: "Rua Domingos de Moraes, 2526", lotacao: 30, capacidade: 100, avaliacao: 3, preco_hora: 35},
    {nome: "Park Econômico", endereco: "Rua Vergueiro, 2728", lotacao: 10, capacidade: 90, avaliacao: 5, preco_hora: 25},
    {nome: "Garage Independência", endereco: "Av. Independência, 2930", lotacao: 75, capacidade: 150, avaliacao: 4, preco_hora: 50},
    {nome: "Park Monumento", endereco: "Rua Bom Pastor, 3132", lotacao: 60, capacidade: 200, avaliacao: 5, preco_hora: 65},
    {nome: "Estacionamento Econômico", endereco: "Rua Líbero Badaró, 3334", lotacao: 20, capacidade: 80, avaliacao: 3, preco_hora: 20},
    {nome: "Park Centro", endereco: "Rua Funchal, 3536", lotacao: 100, capacidade: 100, avaliacao: 4, preco_hora: 45},
    {nome: "Garage Jardim", endereco: "Rua Batataes, 3738", lotacao: 40, capacidade: 50, avaliacao: 3, preco_hora: 30},
    {nome: "Park Simples", endereco: "Rua Harmonia, 3940", lotacao: 15, capacidade: 70, avaliacao: 4, preco_hora: 20},
    {nome: "Garage Compacto", endereco: "Rua Clélia, 4142", lotacao: 55, capacidade: 110, avaliacao: 5, preco_hora: 60},
    {nome: "Park Amplo", endereco: "Av. Regente Feijó, 4344", lotacao: 90, capacidade: 150, avaliacao: 4, preco_hora: 50},
    {nome: "Estacionamento Prático", endereco: "Rua Juventus, 4546", lotacao: 10, capacidade: 200, avaliacao: 3, preco_hora: 25},
    {nome: "Garage Versátil", endereco: "Av. Penha de França, 4748", lotacao: 25, capacidade: 120, avaliacao: 4, preco_hora: 40},
    {nome: "Park Compacto", endereco: "Rua Serra de Bragança, 4950", lotacao: 70, capacidade: 90, avaliacao: 5, preco_hora: 55},
    {nome: "Estacionamento Conveniente", endereco: "Av. Vieira de Morais, 5152", lotacao: 35, capacidade: 110, avaliacao: 4, preco_hora: 30},
    {nome: "Garage Dinâmica", endereco: "Rua Nova York, 5354", lotacao: 30, capacidade: 60, avaliacao: 3, preco_hora: 20},
    {nome: "Park Rápido", endereco: "Av. Santo Amaro, 5556", lotacao: 60, capacidade: 90, avaliacao: 4, preco_hora: 40},
    {nome: "Garage Completa", endereco: "Rua Padre Lebret, 5758", lotacao: 85, capacidade: 100, avaliacao: 5, preco_hora: 70},
    {nome: "Park Prático", endereco: "Estrada de Campo Limpo, 5960", lotacao: 20, capacidade: 50, avaliacao: 3, preco_hora: 25},
    {nome: "Estacionamento Seguro", endereco: "Rua da Capela, 6162", lotacao: 90, capacidade: 200, avaliacao: 4, preco_hora: 50},
    {nome: "Park Simples", endereco: "Rua Descalvado, 6364", lotacao: 40, capacidade: 80, avaliacao: 3, preco_hora: 30},
    {nome: "Garage Ideal", endereco: "Av. dos Autonomistas, 6566", lotacao: 60, capacidade: 150, avaliacao: 5, preco_hora: 55},
    {nome: "Estacionamento Alto Padrão", endereco: "Alameda Rio Negro, 6768", lotacao: 20, capacidade: 120, avaliacao: 3, preco_hora: 20},
    {nome: "Park Fácil Acesso", endereco: "Av. Henriqueta Mendes Guerra, 6970", lotacao: 100, capacidade: 200, avaliacao: 5, preco_hora: 65},
    {nome: "Garage Praticidade", endereco: "Rua Afrânio de Melo Franco, 7172", lotacao: 15, capacidade: 80, avaliacao: 3, preco_hora: 25},
    {nome: "Park Seguro", endereco: "Av. Dom Aguirre, 7374", lotacao: 110, capacidade: 150, avaliacao: 4, preco_hora: 40},
    {nome: "Estacionamento Compacto", endereco: "Rua Barão de Jundiaí, 7576", lotacao: 30, capacidade: 90, avaliacao: 3, preco_hora: 30},
    {nome: "Garage Econômica", endereco: "Rua Barão de Jaguara, 7778", lotacao: 20, capacidade: 40, avaliacao: 4, preco_hora: 20},
    {nome: "Park Premium", endereco: "Av. Presidente Vargas, 7980", lotacao: 50, capacidade: 100, avaliacao: 5, preco_hora: 60},
    {nome: "Estacionamento Executivo", endereco: "Rua Dona Alexandrina, 8182", lotacao: 120, capacidade: 250, avaliacao: 5, preco_hora: 70},
    {nome: "Garage Flex", endereco: "Av. Visconde de Rio Claro, 8384", lotacao: 60, capacidade: 120, avaliacao: 3, preco_hora: 25},
    {nome: "Park Confiável", endereco: "Rua Araújo Leite, 8586", lotacao: 90, capacidade: 140, avaliacao: 4, preco_hora: 50},
    {nome: "Garage Amigável", endereco: "Av. República, 8788", lotacao: 75, capacidade: 100, avaliacao: 4, preco_hora: 40},
    {nome: "Estacionamento Versátil", endereco: "Rua Cel. Marcondes, 8990", lotacao: 50, capacidade: 70, avaliacao: 4, preco_hora: 30}
  ];
}