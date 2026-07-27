from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Admin Panel
    path("admin/", admin.site.urls),

    # JWT Authentication
    path(
        "api/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),

    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    # App URLs (we'll create these next)
    path("api/students/", include("students.urls")),
    path("api/hostels/", include("hostels.urls")),
    path("api/rooms/", include("rooms.urls")),
    path("api/bookings/", include("bookings.urls")),
    path("api/mess/", include("mess.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )