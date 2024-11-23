from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_page, name='login'),
    path('index/', views.index_page, name='index'),
    path('confirmation/', views.confirmation_page, name='confirmation'),
    path('analise/', views.analiseEstacionamento_page, name='analise'),
    path('form/', views.formEstacionamento_page, name='form'),
    path('intrapage/', views.intra_page, name='intra'),
    path('pagamento/', views.pagamento_page, name='pagamento'),
    path('recibo/', views.recibo_page, name='recibo'),  
]
