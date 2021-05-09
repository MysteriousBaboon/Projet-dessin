from rest_framework import viewsets
from .serializers import QuestionSerializer
from .models import Question
import random

# grab the max id in the database
max_id = Question.objects.order_by('-id')[0].id


class QuestionView(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer

    # grab a random possible id. we don't know if this id does exist in the database, though

    # return an object with that id, or the first object with an id greater than that one
    # this is a fast lookup, because your primary key probably has a RANGE index.

    def get_queryset(self):
        random_id = random.randint(1, max_id)
        print(random_id)
        return Question.objects.all().filter(id= random_id)
