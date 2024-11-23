from django.shortcuts import render

# Create your views here.
def login_page(request):
    return render(request, 'vagacerta/login.html')

def index_page(request):
    return render(request, 'vagacerta/index.html')

def searchBar(request):
    return render(request, 'vagacerta/searchBar.html')

def confirmation_page(request):
    return render(request, 'vagacerta/confirmation.html')

def formEstacionamento_page(request):
    return render(request, 'vagacerta/form-estacionamento.html')

def analiseEstacionamento_page(request):
    return render(request, 'vagacerta/analise-estacionamento.html')

def intra_page(request):
    return render(request, 'vagacerta/intrapage.html')

def recibo_page(request):
    return render(request, 'vagacerta/recibo.html')

def pagamento_page(request):
    return render(request, 'vagacerta/pagamento.html')
