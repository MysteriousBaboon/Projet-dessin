# Generated by Django 3.2.2 on 2021-05-08 09:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Todo',
            new_name='Question',
        ),
    ]
