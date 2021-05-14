from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
import uuid


# Create your models here.
class Question(models.Model):
    question = models.CharField(max_length=120)
    answer = models.CharField(max_length=120)
    genre = models.CharField(max_length=20)

    def _str_(self):
        return self.question

