from django.contrib import admin
from django.urls import path, include
from api import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('code', views.code, name='code'),
    path('', include('api.urls')),

]