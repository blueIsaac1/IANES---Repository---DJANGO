# Generated by Django 5.0.7 on 2024-11-12 16:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Main', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='botresponse',
            name='room',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='bot_response', to='Main.room'),
        ),
        migrations.AlterField(
            model_name='usermessage',
            name='room',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_message', to='Main.room'),
        ),
    ]
