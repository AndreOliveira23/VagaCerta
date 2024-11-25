// Inicializa o mapa com a posição e zoom definidos
var map = L.map('map', {
  center: [-23.5489, -46.6388], // Coordenadas para São Paulo
  zoom: 12,
  zoomControl: false // Desativa o controle de zoom padrão
});

// Adiciona uma camada de mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Adiciona o ícone de menu no canto superior esquerdo
var menuIcon = L.control({ position: 'topleft' });

menuIcon.onAdd = function () {
  var div = L.DomUtil.create('div', 'menu-icon');
  div.innerHTML = `
      <button class="circle transparent" onclick="abrirSidebar()">
          <i id="menu-icon-mapa">menu</i>
      </button>`;
  return div;
};
menuIcon.addTo(map);

// Função para abrir a sidebar
function abrirSidebar() {
  document.querySelector('#dialog').show();
}

// Função para fechar a sidebar
function fecharSidebar() {
  document.querySelector('#dialog').close();
}

// Controle de zoom personalizado
document.getElementById('botaoZoomIn').onclick = function () {
  map.zoomIn();
};

document.getElementById('botaoZoomOut').onclick = function () {
  map.zoomOut();
};

// Adiciona a barra de pesquisa
const searchControl = new GeoSearch.GeoSearchControl({
  provider: new GeoSearch.OpenStreetMapProvider(),
  style: 'bar',
});
map.addControl(searchControl);

// Integra a barra de pesquisa estilizada
const searchInput = document.getElementById("search");
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
      clicar();
  }
});

function clicar() {
  const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      which: 13,
      keyCode: 13,
  });
  const elements = document.getElementsByClassName('glass');
  if (elements.length > 0) {
      elements[0].dispatchEvent(event);
      setTimeout(setRoute, 2000);
  }
}

// Define um ícone personalizado para os estacionamentos
var parkingIcon = L.icon({
  iconUrl: '/static/images/map-marker-svgrepo-com.svg', // Caminho para o ícone personalizado
  iconSize: [30, 30], // Tamanho do ícone
  iconAnchor: [15, 15], // Âncora do ícone (ponto onde ele será "ancorado" no mapa)
  popupAnchor: [0, -15] // Âncora do popup em relação ao ícone
});

// Função para exibir os estacionamentos cadastrados no mapa
function exibirEstacionamentos() {
  // Obtém o JSON dos estacionamentos do elemento HTML
  var estacionamentosData = JSON.parse(document.getElementById('estacionamentos-data').textContent);

  estacionamentosData.forEach(function (estacionamento) {
      var lat = estacionamento.fields.latitude;
      var lng = estacionamento.fields.longitude;
      var nome = estacionamento.fields.nome;
      var endereco = estacionamento.fields.endereco;
      var capacidade = estacionamento.fields.capacidade;
      var precoPorHora = estacionamento.fields.preco_por_hora;
      var vagasOcupadas = estacionamento.fields.ocupadas || 0; // Assumindo que vagas ocupadas estão disponíveis no backend
      var vagasDisponiveis = capacidade - vagasOcupadas;

      // Adiciona marcador ao mapa
      var marker = L.marker([lat, lng], { icon: parkingIcon }).addTo(map);

      // Adiciona popup ao marcador
      marker.bindPopup(`
          <b>${nome}</b><br>
          <p><strong>Endereço:</strong> ${endereco}</p>
          <p><strong>Preço por hora:</strong> R$ ${precoPorHora}</p>
          <p><strong>Vagas disponíveis:</strong> ${vagasDisponiveis}</p>
      `);
  });
}

// Função para localizar o usuário
navigator.geolocation.getCurrentPosition(function (position) {
  var userLocation = L.latLng(position.coords.latitude, position.coords.longitude);
  map.setView(userLocation, 15);

  // Adiciona um marcador na localização do usuário com o ícone padrão
  L.marker(userLocation).addTo(map).bindPopup("Você está aqui!").openPopup();
}, function (error) {
  console.error("Erro na geolocalização: " + error.message);
  alert("Não foi possível determinar a sua localização. Certifique-se de que o GPS está habilitado.");
});


// Chama a função para exibir os estacionamentos no mapa
exibirEstacionamentos();
