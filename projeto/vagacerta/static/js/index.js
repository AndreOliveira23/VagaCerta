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
  div.innerHTML = '<button class="circle transparent" onclick="abrirSidebar(),fecharModalEstacionamento()">\
                        <i id="menu-icon-mapa">menu</i>\
                   </button>';
  return div;
};

menuIcon.addTo(map);

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


rotaCounter = 0;
i = 0;

function setRoute(){

  /*Removendo marcador antigo, colocado sobre o destino encontrado, para não sobrepor o novo marcador
  que será colocado no destino da rota*/

  map.eachLayer((layer) => {
    if (layer instanceof L.Polyline) {
        console.log("This is a Polyline.");
        layer.remove();
    }

    if (layer instanceof L.Polygon) {
        console.log("This is a Polygon.");
        layer.remove();
    }

    if (layer instanceof L.LayerGroup) {
        console.log("This is a Layer Group.");
        layer.remove();
    }

    if (layer instanceof L.Control.Layers) {
        layer.remove();
    }
  });

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

  //Remove a barra de rotas anterior
    setTimeout(function(){
        document.getElementsByClassName("leaflet-routing-container leaflet-bar leaflet-control")[i].style.display = "none";
        i++;
    }, 500);

    //Cria a nova rota
    setTimeout(function(){
        var destino = map.getCenter();
        L.Routing.control({
            waypoints: [
                userLocation,
                destino
            ]
        }).addTo(map);
    },2000);
}


/********************************************MOCKS**********************************/

/*
function mockLocation(inputValue){

  if(inputValue.toLowerCase() === "neo quimica arena"){
    
    map.setView([-23.545694237082536, -46.47390604019166], 17);

    var marker = L.marker([-23.544936895841495, -46.47334814071655]).addTo(map);
    marker.bindPopup("<b>Neo Química Arena</b><br>Estádio do Corinthians").openPopup();

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

    criarMarcadorEstacionamento(-23.546825323021206, -46.47388458251953, "Estacionamento 2");

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

  if(inputValue.toLowerCase() === "estadio do morumbi"){
        
      map.setView([-23.597, -46.720], 17);
  
      var marker = L.marker([-23.597, -46.720]).addTo(map);
      marker.bindPopup("<b>Estádio do Morumbi</b><br>Estádio do São Paulo").openPopup();
  
      //Colocar marcadores nos estacionamentos ao redor do estádio
  
      criarMarcadorEstacionamento(-23.597, -46.720, "Estacionamento 1");
  
      criarMarcadorEstacionamento(-23.597, -46.720, "Estacionamento 2");
  
      criarMarcadorEstacionamento(-23.597, -46.720, "Estacionamento 3");
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
