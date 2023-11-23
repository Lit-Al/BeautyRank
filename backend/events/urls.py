from django.urls import path

from .views import EventViewSet

urlpatterns = [
    path('master_page', EventViewSet.as_view({'post': 'master_page'}), name='master_page') ,
]

#     path('evaluations/<pk>', views.EvaluationsView.as_view(), name='evaluations'),
#     path('master_page', views.MasterPageView.as_view(), name='master_page'),
#     path('referee_assessment/<pk>', views.RefereeAssessmentView.as_view(), name='referee_assessment'),
#     path('referee_page', views.RefereePageView.as_view(), name='referee_page'),
#     path('upload_photo/<pk>', views.UploadPhotoView.as_view(), name='upload_photo'),
#     path('resultOfAllEvents', views.ResultOfAllEvents.as_view(), name='end_result')
