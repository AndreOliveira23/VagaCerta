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

  const search = new GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(),
  });
  
  map.addControl(search);