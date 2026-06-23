from django.urls import path
from .views import hostel_list,room_list

urlpatterns = [
    path('hostels/',hostel_list,name='hostel_list'),
    path("rooms/<int:hostel_id>/",room_list,name="room_list"
    ),
]