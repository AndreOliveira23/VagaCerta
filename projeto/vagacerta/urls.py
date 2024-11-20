from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_page, name='login'),
    path('index/', views.index_page, name='index'),
    path('search/', views.searchBar, name='search'),
    path('pagamento/', views.pagamento_page, name='pagamento'),
]
