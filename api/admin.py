from django.contrib import admin
from .models import Question


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question', 'answer', 'genre')


# Register your models here.
admin.site.register(Question, QuestionAdmin)