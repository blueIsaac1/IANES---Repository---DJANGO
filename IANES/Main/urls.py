from django.urls import path
from . import views

urlpatterns = [
    path('', views.auth, name='auth'),
    path('index/', views.index, name='index'),
    path('chat/', views.chat, name="chat")
]