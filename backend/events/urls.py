from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberNominationViewSet

router = DefaultRouter()
router.register(prefix='memberNomination', viewset=MemberNominationViewSet)
urlpatterns = [
    path('', include(router.urls)),
]

#     path('evaluations/<pk>', views.EvaluationsView.as_view(), name='evaluations'),
#     path('master_page', views.MasterPageView.as_view(), name='master_page'),
#     path('referee_assessment/<pk>', views.RefereeAssessmentView.as_view(), name='referee_assessment'),
#     path('referee_page', views.RefereePageView.as_view(), name='referee_page'),
#     path('upload_photo/<pk>', views.UploadPhotoView.as_view(), name='upload_photo'),
#     path('resultOfAllEvents', views.ResultOfAllEvents.as_view(), name='end_result')
