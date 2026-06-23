from django.urls import path
from .views import hostel_list,room_list,book_room,admin_bookings,approve_booking,reject_booking,my_room

urlpatterns = [
    path('hostels/',hostel_list,name='hostel_list'),
    path("rooms/<int:hostel_id>/",room_list,name="room_list"),
    path("book-room/<int:room_id>/",book_room,name="book_room"),
     path("admin-bookings/",admin_bookings,name="admin_bookings"),
    path("approve-booking/<int:booking_id>/",approve_booking,name="approve_booking"),
    path("reject-booking/<int:booking_id>/",reject_booking,name="reject_booking"),
    path("my-room/",my_room,name="my_room"),
]