from django.urls import path
from . import views
from django.conf.urls import handler404
from django.conf import settings 
from django.conf.urls.static import static

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
    path('delete-room/<pk>/', views.delete_room, name="delete_room"),
    path('<pk>/', views.RoomDetailView.as_view(), name="room_detail"),
    path('<pk>/send/', views.send_message, name="send_message"),
    path('some_view/', views.some_view, name='some_view'),
    path('IAnes/<int:pk>/download_pdf/', views.processar_e_enviar_pdf, name='download_pdf'),
    path('enviar_email/<pk>/', views.processar_e_enviar_pdf, name='enviar_email'),
    path('IAnes/<pk>/processar_audio/', views.processar_audio_ianes, name='processar_audio'),
    # path('reproduzir_audio/', views.reproduzir_audio, name='reproduzir_audio'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)