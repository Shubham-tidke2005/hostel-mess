from rest_framework.routers import DefaultRouter
from .views import MessMenuViewSet

router = DefaultRouter()
router.register(r'', MessMenuViewSet, basename='mess')

urlpatterns = router.urls