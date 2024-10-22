from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_messages, name='list_messages'),
    # path('index/', views.index, name='index'),
    # path('chat/', views.chat, name="chat"),
    path('send', views.send_messages, name='send_messages')
]