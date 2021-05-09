from rest_framework import viewsets
from .serializers import QuestionSerializer
from .models import Question


class QuestionView(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()


