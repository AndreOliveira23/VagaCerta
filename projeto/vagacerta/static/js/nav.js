function abrirSidebar(){
    event.stopImmediatePropagation();
    document.querySelector('#dialog').show();
}
  
function fecharSidebar(){
    document.querySelector('#dialog').close();
}

function mostrarPagamento(tipo) {
    const opcoes = document.querySelectorAll('.pagamento-opcao');
    opcoes.forEach(opcao => opcao.style.display = 'none');

    const selecionado = document.getElementById(tipo);
    selecionado.style.display = 'block';
}