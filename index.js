
//Inicializa o modal do Materialize CSS
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {});
});


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
map.on('click', function(ev){
  var latlng = map.mouseEventToLatLng(ev.originalEvent);
  console.log(latlng.lat + ', ' + latlng.lng);
  
  L.marker([latlng.lat, latlng.lng]).addTo(map).on('click', function() {
      var modalInstance = M.Modal.getInstance(document.getElementById('modal1'));
      modalInstance.open();
  }).bindPopup("Estacionamento");
});


/*Acredito que elementos comuns do HTML não aparecem sobre o mapa, então é necessário adicionar eles como controles do Leaflet,
para que possam ser adicionados ao mapa através do método addTo(map)*/


//Adiciona o ícone de menu
var menuIcon = L.control({position: 'topleft'});

menuIcon.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'search-button');
  div.innerHTML = '<i class=\'bx bx-menu\' style=" background-color: white; font-size: 32px; border-radius: 2px" onclick="sidebar()"></i>';
  return div;
};

menuIcon.addTo(map);

//Adiciona sidebar
var sideBar = L.control();

sideBar.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'sidebar2');
  div.innerHTML = '\
    <div id="sidebar" class="w3-sidebar w3-light-grey w3-bar-block">\
          <h3 class="w3-bar-item">Menu</h3>\
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

//Faz com que a busca seja feita ao apertar Enter na barra de pesquisa
function handleSearch(){ 
  if(event.key === 'Enter') {
    var search = document.getElementById("search").value;
    console.log(search);
    var geocodeService = L.esri.Geocoding.geocodeService();
    geocodeService.geocode().text(search).run(function (error, results, response) {
        if (error) {
            console.log(error);
            alert("Não foi possível encontrar o local");
            return;
        }
        console.log(results.results[0].latlng);
        map.setView([results.results[0].latlng.lat, results.results[0].latlng.lng], 16);
    });
  }
}