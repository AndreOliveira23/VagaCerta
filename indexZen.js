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

//Barra de pesquisa
const searchControl = new GeoSearch.GeoSearchControl({
  provider: new GeoSearch.OpenStreetMapProvider(),
  style: 'bar',
});
map.addControl(searchControl);


const textbox = document.getElementById("search");
const searchInput = document.getElementById("search");
textbox.addEventListener("keypress", function onEvent(event) {
    if (event.key === "Enter") {
      console.log("Entered value:", searchInput.value);
      document.querySelector('.glass').value = searchInput.value;
      clicar();
    }
});

function clicar(){
  // create a new keyboard event and set the key to "Enter"
const event = new KeyboardEvent('keydown', {
  key: 'Enter',
  code: 'Enter',
  which: 13,
  keyCode: 13,
});

// dispatch the event on some DOM element
const elements = document.getElementsByClassName('glass'); // Replace 'myInputClass' with your actual class name
  if (elements.length > 0) {
    elements[0].dispatchEvent(event); // Dispatch the event on the first element with the specified class
  }
}


/********************************************MOCKS**********************************/

/*
function mockLocation(inputValue){

  if(inputValue.toLowerCase() === "neo quimica arena"){
    
    map.setView([-23.545694237082536, -46.47390604019166], 17);

    var marker = L.marker([-23.544936895841495, -46.47334814071655]).addTo(map);
    marker.bindPopup("<b>Neo Química Arena</b><br>Estádio do Corinthians").openPopup();

    //Colocar marcadores nos estacionamentos ao redor do estádio

    criarMarcadorEstacionamento(-23.54525163558828, -46.4764165878296, "Estacionamento 1");

    criarMarcadorEstacionamento(-23.546825323021206, -46.47388458251953, "Estacionamento 2");

    criarMarcadorEstacionamento(-23.545035252093307, -46.47062301635743, "Estacionamento 3");
    
    criarMarcadorEstacionamento(-23.54475001876039, -46.472318172454834, "Estacionamento 4");
  }

  if(inputValue.toLowerCase() === "allianz parque"){
      
      map.setView([-23.5280972212507, -46.67841911315919], 17);
  
      var marker = L.marker([-23.52699548517475, -46.67864441871644]).addTo(map);
      marker.bindPopup("<b>Allianz Parque</b><br>Estádio do Palmeiras").openPopup();
  
      //Colocar marcadores nos estacionamentos ao redor do estádio
  
      criarMarcadorEstacionamento(-23.526179014096655, -46.678451299667366, "Estacionamento 1");
  
      criarMarcadorEstacionamento(-23.525392049227378, -46.67821526527405, "Estacionamento 2");
  
      criarMarcadorEstacionamento(-23.525018239266025, -46.678987741470344, "Estacionamento 3");
      
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

  if(inputValue.toLowerCase() === "estadio do pacaembu"){
            
      map.setView([-23.547, -46.657], 17);
    
      var marker = L.marker([-23.547, -46.657]).addTo(map);
      marker.bindPopup("<b>Estádio do Pacaembu</b><br>Estádio do Vaxco").openPopup();
    
      //Colocar marcadores nos estacionamentos ao redor do estádio
    
      criarMarcadorEstacionamento(-23.547, -46.657, "Estacionamento 1");
    
      criarMarcadorEstacionamento(-23.547, -46.657, "Estacionamento 2");
    
      criarMarcadorEstacionamento(-23.547, -46.657, "Estacionamento 3");
    }   

  if(inputValue.toLowerCase() === "estadio são januário"){
                
        map.setView([-22.906, -43.230], 17);
        
        var marker = L.marker([-22.906, -43.230]).addTo(map);
        marker.bindPopup("<b>Estádio São Januário</b><br>Estádio do Vasco").openPopup();
        
        //Colocar marcadores nos estacionamentos ao redor do estádio
        
        criarMarcadorEstacionamento(-22.906, -43.230, "Estacionamento 1");
        
        criarMarcadorEstacionamento(-22.906, -43.230, "Estacionamento 2");
        
        criarMarcadorEstacionamento(-22.906, -43.230, "Estacionamento 3");
      }
    
}

function criarMarcadorEstacionamento (lat, long, nome) {
  var marker = L.marker([lat, long]).addTo(map);
  marker.bindPopup("<b>"+nome+"</b><br>Estacionamento");
  marker.setIcon(L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }));
}
*/
