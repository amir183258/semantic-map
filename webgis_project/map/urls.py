from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_page, name='login_page'),
    path('map/', views.map, name='map'),
    path('logout/', views.logout_page, name='logout_page'),
]