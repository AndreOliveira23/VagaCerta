from django.shortcuts import render

# Create your views here.
def login_page(request):
    return render(request, 'vagacerta/login.html')

def index_page(request):
    return render(request, 'vagacerta/index.html')

def searchBar(request):
    return render(request, 'vagacerta/searchBar.html')