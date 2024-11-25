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

function abrirModalEstacionamento(estacionamento) {
  // Preenche o modal com os dados do estacionamento
  document.getElementById('nome-do-estacionamento').innerText = estacionamento.fields.nome;
  document.getElementById('endereco-do-estacionamento').innerText = estacionamento.fields.endereco;
  document.getElementById('porcentagem-ocupacao').innerText = `Vagas disponíveis: ${estacionamento.fields.capacidade - (estacionamento.fields.ocupadas || 0)}`;
  document.getElementById('valor').innerText = `Preço por hora: R$ ${estacionamento.fields.preco_por_hora}`;
  document.getElementById('foto-estacionamento').innerHTML = `
      <div class="s6">
        <img src="/static/images/img2.jpg" alt="Imagem do estacionamento" style="width:100%; height:100%;">
      </div>
      <div class="s6">
        <img src="/static/images/img3.jpg" alt="Imagem do estacionamento" style="width:100%; height:100%;">
      </div>
  `;

  // Abre o modal
  const modal = document.getElementById('modal');
  modal.showModal();
}

// Função para exibir os estacionamentos com marcadores e adicionar evento de clique
function exibirEstacionamentos() {
  var estacionamentosData = JSON.parse(document.getElementById('estacionamentos-data').textContent);

  estacionamentosData.forEach(function (estacionamento) {
      var lat = estacionamento.fields.latitude;
      var lng = estacionamento.fields.longitude;

      // Adiciona marcador ao mapa
      var marker = L.marker([lat, lng], { icon: parkingIcon }).addTo(map);

      // Adiciona evento de clique para abrir o modal
      marker.on('click', function () {
          abrirModalEstacionamento(estacionamento);
      });
  });
}
function isValidDate(dateString) {
  // Regex para validar formato YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString) && !isNaN(new Date(dateString).getTime());
}

function isValidTime(timeString) {
  // Regex para validar formato HH:MM
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(timeString);
}

function updateDataChegada(input) {
  if (isValidDate(input.value)) {
      document.getElementById('dataHoraChegada').innerText = `${input.value} ${document.getElementById('horaChegadaInput').value || ''}`;
      calcularTotalHoras();
  } else {
      alert('Insira uma data válida no formato YYYY-MM-DD.');
      input.value = '';
  }
}

function updateHoraChegada(input) {
  if (isValidTime(input.value)) {
      document.getElementById('dataHoraChegada').innerText = `${document.getElementById('dataChegadaInput').value || ''} ${input.value}`;
      calcularTotalHoras();
  } else {
      alert('Insira um horário válido no formato HH:MM.');
      input.value = '';
  }
}

function updateDataSaida(input) {
  if (isValidDate(input.value)) {
      document.getElementById('dataHoraSaida').innerText = `${input.value} ${document.getElementById('horaSaidaInput').value || ''}`;
      calcularTotalHoras();
  } else {
      alert('Insira uma data válida no formato YYYY-MM-DD.');
      input.value = '';
  }
}

function updateHoraSaida(input) {
  if (isValidTime(input.value)) {
      document.getElementById('dataHoraSaida').innerText = `${document.getElementById('dataSaidaInput').value || ''} ${input.value}`;
      calcularTotalHoras();
  } else {
      alert('Insira um horário válido no formato HH:MM.');
      input.value = '';
  }
}

function calcularTotalHoras() {
  const chegada = new Date(`${document.getElementById('dataChegadaInput').value}T${document.getElementById('horaChegadaInput').value}`);
  const saida = new Date(`${document.getElementById('dataSaidaInput').value}T${document.getElementById('horaSaidaInput').value}`);
  
  if (chegada && saida && saida > chegada) {
      const diff = Math.abs(saida - chegada) / 36e5; // Diferença em horas
      document.getElementById('totalHoras').innerText = diff.toFixed(1);
  } else {
      document.getElementById('totalHoras').innerText = '0';
  }
}

function calcularTotal() {
  const totalHoras = calcularTotalHoras();
  const precoPorHora = parseFloat(document.getElementById('precoPorHora').value);

  if (!isNaN(precoPorHora) && totalHoras > 0) {
      const precoTotal = totalHoras * precoPorHora;
      document.getElementById('precoTotal').innerText = `R$ ${precoTotal.toFixed(2)}`;
  } else {
      document.getElementById('precoTotal').innerText = 'R$ 0.00';
  }
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

document.getElementById('search').addEventListener('input', function (e) {
  const query = e.target.value.toLowerCase();
  console.log('Buscando por:', query);
  // Adicione aqui a lógica para filtrar ou pesquisar.
});
