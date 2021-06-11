from django.contrib import admin
from .models import Question


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question', 'answer', 'genre', 'false_answer1', 'false_answer2', 'false_answer3')
    readonly_fields = ('id',)


# Register your models here.
admin.site.register(Question, QuestionAdmin)
