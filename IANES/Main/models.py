from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
# from django.contrib.auth.models import AbstractUser
# Create your models here.

# class CustomUser(AbstractUser):
#     image_url = models.ImageField(blank=True, null=True, default="https://avatar.iran.liara.run/public")

class Room(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=30, default='Sala Nova')
    # user_message = models.ManyToManyField('UserMessage', blank=True)
    # bot_response = models.ManyToManyField('BotResponse', blank=True)

    # def __str__(self):
    #     return f"Session for {self.user.username} at {self.created_at}" 
    def __str__(self):
        return f"{self.title} {self.user}"
    
    def get_id(self):
        return self.id
    
    

class BotResponse(models.Model):
    room = models.ForeignKey(Room, related_name='bot_response', on_delete=models.CASCADE, null=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"IANES: {self.text}"


class UserMessage(models.Model):
    room = models.ForeignKey(Room, related_name='user_message', on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.text}"
    


# class ChatMessage(models.Model):
#     session = models.ForeignKey(Room, on_delete=models.CASCADE)
#     user_message = models.TextField()
#     bot_response = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"User: {self.user_message}, Bot: {self.bot_response}"
