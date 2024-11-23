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
    return render(request, 'vagacerta/analise-form-estacionamento.html')

def intra_page(request):
    return render(request, 'vagacerta/intrapage.html')

def recibo_page(request):
    return render(request, 'vagacerta/recibo.html')

def pagamento_page(request):
    return render(request, 'vagacerta/pagamento.html')

# def login_page(request):
#     if request.method == 'POST':
#         action = request.POST.get('action')

#         if action == 'register':
#             email = request.POST['email']
#             password = request.POST['password']
            
#             if User.objects.filter(username=email).exists():
#                 messages.error(request, "Esse email já está em uso.")
#             else:
#                 user = User.objects.create_user(username=email, password=password)
#                 user.save()
#                 messages.success(request, "Cadastro realizado com sucesso! Agora, faça seu login.")
#                 return redirect('login') 
        
#         elif action == 'login':
#             email = request.POST['email']
#             password = request.POST['password']
            
#             user = authenticate(request, username=email, password=password)
#             if user is not None:
#                 login(request, user)
#                 return redirect('pagamento')  
#             else:
#                 messages.error(request, "Credenciais inválidas.")
    
#     return render(request, 'vagacerta/login.html')