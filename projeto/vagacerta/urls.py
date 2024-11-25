from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_page, name='login'),
    path('index/', views.index_page, name='index'),
    path('search/', views.searchBar, name='search'),
    path('confirmation/', views.confirmation, name='confirmation'),
    path('analise-form-estacionamento/', views.analise_form_estacionamento, name='analise'),
    path('form-estacionamento/', views.form_estacionamento, name='form'),
    path('intrapage/', views.intrapage, name='intrapage'),
    path('pagamento/', views.pagamento, name='pagamento'),
    path('recibo/', views.recibo, name='recibo'),
]
