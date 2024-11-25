from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .models import Estacionamento, DonoDeEstacionamento

# Create your views here.
def login_page(request):
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'register':
            email = request.POST['email']
            password = request.POST['password']
          
            if User.objects.filter(username=email).exists():
                messages.error(request, "Esse email já está em uso.")
            else:
                user = User.objects.create_user(username=email, password=password)
                user.save()
                messages.success(request, "Cadastro realizado com sucesso! Agora, faça seu login.")
                return redirect('login') 
      
        elif action == 'login':
            email = request.POST['email']
            password = request.POST['password']
          
            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('confirmation')  # Alterado para redirecionar para 'confirmation'
            else:
                messages.error(request, "Credenciais inválidas.")
  
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
    if request.method == 'POST':
        # Capturar dados do formulário
        nome_dono = request.POST.get('nomeDono')
        email_dono = request.POST.get('emailDono')
        telefone_dono = request.POST.get('telefone')
        cnpj_dono = request.POST.get('cnpj')
        nome_estacionamento = request.POST.get('nomeEstacionamento')
        capacidade = request.POST.get('capacidade')
        endereco = request.POST.get('endereco')
        custo_hora = request.POST.get('custoHora')

        print(f"Dados recebidos: Nome: {nome_dono}, Custo Hora: {custo_hora}")

        # Validar campos obrigatórios
        if not nome_dono or not email_dono or not telefone_dono or not cnpj_dono:
            messages.error(request, "Todos os campos do dono são obrigatórios!")
            return redirect('form')

        if not nome_estacionamento or not capacidade or not endereco or not custo_hora:
            messages.error(request, "Todos os campos do estacionamento são obrigatórios!")
            return redirect('form')

        try:
            # Verifica se o dono já existe
            dono, created = DonoDeEstacionamento.objects.get_or_create(
                email=email_dono,
                defaults={
                    'nome': nome_dono,
                    'telefone': telefone_dono,
                    'cnpj': cnpj_dono,
                }
            )
            
            # Cria o estacionamento
            estacionamento = Estacionamento.objects.create(
                nome=nome_estacionamento,
                endereco=endereco,
                capacidade=int(capacidade),
                preco_por_hora=float(custo_hora),  # Converte custo_hora para float
                dono=dono
            )
            print(f"Estacionamento criado: {estacionamento}")

            messages.success(request, "Estacionamento cadastrado com sucesso!")
            return redirect('analise')
        except Exception as e:
            print(f"Erro ao salvar dados: {e}")
            messages.error(request, "Ocorreu um erro ao tentar salvar o estacionamento.")
            return redirect('form')

    return render(request, 'vagacerta/form-estacionamento.html')

def intrapage(request):
    return render(request, 'vagacerta/intrapage.html')

def pagamento(request):
    return render(request, 'vagacerta/pagamento.html')

def recibo(request):
    return render(request, 'vagacerta/recibo.html')