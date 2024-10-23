from django.contrib import admin
from .models import Room, BotResponse, UserMessage
# Register your models here.
admin.site.register(Room)
admin.site.register(BotResponse)
admin.site.register(UserMessage)