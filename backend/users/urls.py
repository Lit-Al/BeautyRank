from django.urls import path
from .views import UserViewSet

urlpatterns = [
    path('index', UserViewSet.as_view({'post': 'login_in'}), name='index'),
    path('confirmation', UserViewSet.as_view({'post': 'check_code'}), name='confirmation'),
    path('photo_selection/<int:pk>/', UserViewSet.as_view({'put': 'photo_selection'}), name='photo_selection_put'),
]
