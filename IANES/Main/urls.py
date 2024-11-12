from django.urls import path
from . import views
from django.conf.urls import handler404

handler404 = views.catch_error_404

urlpatterns = [
    # path('', views.list_messages, name='list_messages'),
    # path('index/', views.index, name='index'),
    # path('chat/', views.chat, name="chat"),
    # path('send', views.send_messages, name='send_messages'),
    # path('create_chat/', views.create_chat, name='create_chat')
    path('', views.auth, name="auth"),
    path('logout/', views.logout, name='logout'),
    path('index/', views.index, name="index"),
    path('IAnes/', views.list_messages, name="list_messages"),
    path('IAnes/<pk>/', views.list_messages, name="list_messages"),
    path('create-room/', views.create_room, name="create_room"),
    path('delete-room/<int:id>/', views.delete_room, name="delete_room"),
    path('<pk>/', views.RoomDetailView.as_view(), name="room_detail"),
    path('<pk>/send/', views.send_message, name="send_message"),
    path('some_view/', views.some_view, name='some_view'),
]