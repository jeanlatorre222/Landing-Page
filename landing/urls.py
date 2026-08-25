from django.urls import path
from . import views

app_name = 'landing'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/select-room/', views.api_select_room, name='api_select_room'),
    path('reserve/login/', views.reserve_login, name='reserve_login'),
    path('reserve/', views.reserve_dashboard, name='reserve_dashboard'),
    path('api/add-review/', views.api_add_review, name='api_add_review'),
]
