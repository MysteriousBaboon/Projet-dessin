from django.contrib import admin
from .models import Question


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question', 'answer', 'genre')
    readonly_fields = ('id',)



# Register your models here.
admin.site.register(Question, QuestionAdmin)