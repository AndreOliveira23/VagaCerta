from django.shortcuts import render

# Create your views here.
def login_page(request):
    return render(request, 'vagacerta/login.html')

def index_page(request):
    return render(request, 'vagacerta/index.html')

def searchBar(request):
    return render(request, 'vagacerta/search-bar.html')

def confirmation(request):
    return render(request, 'vagacerta/confirmation.html')

def analise_form_estacionamento(request):
    return render(request, 'vagacerta/analise-form-estacionamento.html')

def form_estacionamento(request):
    return render(request, 'vagacerta/form-estacionamento.html')

def intrapage(request):
    return render(request, 'vagacerta/intrapage.html')

def pagamento(request):
    return render(request, 'vagacerta/pagamento.html')

def recibo(request):
    return render(request, 'vagacerta/recibo.html')