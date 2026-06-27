from django.urls import path
from . import views

urlpatterns = [

    path(
        "dashboard/",
        views.hosteller_dashboard,
        name="hosteller_dashboard"
    ),
    path(
        "",
        views.hosteller_list,
        name="hosteller_list"
    ),

    path(
        "add/",
        views.add_hosteller,
        name="add_hosteller"
    ),
]