# Generated by Django 4.2 on 2023-04-20 21:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='session',
            field=models.CharField(max_length=15, null=True, unique=True),
        ),
    ]