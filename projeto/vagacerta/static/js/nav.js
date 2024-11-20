function abrirSidebar(){
    event.stopImmediatePropagation();
    document.querySelector('#dialog').show();
}
  
function fecharSidebar(){
    document.querySelector('#dialog').close();
}