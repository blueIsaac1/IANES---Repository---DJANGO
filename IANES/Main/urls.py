from django.urls import path
from . import views

urlpatterns = [
    # path('', views.list_messages, name='list_messages'),
    # path('index/', views.index, name='index'),
    # path('chat/', views.chat, name="chat"),
    # path('send', views.send_messages, name='send_messages'),
    # path('create_chat/', views.create_chat, name='create_chat')
    path('', views.auth, name="auth"),
    path('index/', views.index, name="index"),
    path('IAnes/<pk>/', views.list_messages, name="list_messages"),
    path('create-room/', views.create_room, name="create_room"),
    path('<pk>/', views.RoomDetailView.as_view(), name="room_detail"),
    path('<pk>/send/', views.send_message, name="send_message"),
]