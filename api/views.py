from api.models import Question


def code(request):
    print(Question.Objects)
    Question.objects.bulk_create(questions)




